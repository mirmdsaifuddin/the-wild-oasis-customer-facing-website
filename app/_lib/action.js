"use server";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
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

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function SignOutAction() {
  await signOut({ redirectTo: "/" });
}
