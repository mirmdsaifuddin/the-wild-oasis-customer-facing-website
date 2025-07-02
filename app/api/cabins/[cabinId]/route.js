import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  try {
    const [cabin, bookedBydated] = await Promise.all([
      getCabin(params.cabinId),
      getBookedDatesByCabinId(params.cabinId),
    ]);
    return Response.json({ cabin, bookedBydated });
  } catch (error) {
    return Response.json({ message: "cabin could not be found" });
  }
}
