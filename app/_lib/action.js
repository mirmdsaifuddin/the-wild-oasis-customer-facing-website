"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");

  const [nationality, countryFlag] = formData.get("nationality").split("%");
  function isValidNationalID(id) {
    const nationalIDPattern = /^[A-Za-z0-9]+$/;
    return nationalIDPattern.test(id);
  }
  if (!isValidNationalID(nationalID))
    throw new Error("Please provide a valid national ID");
  const updatedData = { nationalID, nationality, countryFlag };
  //console.log(updatedData);

  //updating in database supabase
  const { data, error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  console.log(newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId) {
  // await new Promise((res) => setTimeout(res, 2000));
  // throw new Error();
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBooking = await getBookings(session.user.guestId);
  const guestBookingIds = guestBooking.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this bookings");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservation");
}

export async function updateBookins(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBooking = await getBookings(session.user.guestId);
  const guestBookingIds = guestBooking.map((booking) => booking.id);
  const bookingId = Number(formData.get("bookingId"));
  const observations = formData.get("observations");
  const numGuests = Number(formData.get("numGuests"));
  // console.log(formData);
  // console.log(guestBookingIds);
  const updatedFields = { numGuests, observations };

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to Updates this bookings");

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function SignOutAction() {
  await signOut({ redirectTo: "/" });
}
