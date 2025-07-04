"use client";
import { differenceInDays } from "date-fns";
import { useReservation } from "../context/ReservationContext";
import { createBooking } from "../_lib/action";
import ReserveButton from "./ReserveButton";
import Image from "next/image";

function ReservationForm({ cabin, user }) {
  // CHANGE
  //const maxCapacity = cabin.maxCapacity;
  const { range, resetRange } = useReservation();
  const { regularPrice, discount, maxCapacity, id } = cabin;
  const startDate = range.from;
  const endDate = range.to;
  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };
  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center relative">
          <div className="relative h-8 w-8">
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={(formData) => {
          createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-center items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>
        </div>
        <ReserveButton startDate={startDate} endDate={endDate} />
      </form>
    </div>
  );
}

export default ReservationForm;
