import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";
import { unstable_noStore as noStore } from "next/cache";

//export const fetchCache = "force-no-store";
async function CabinList({ filter }) {
  noStore();
  const cabins = await getCabins();
  if (!cabins.length) return null;

  let displayCabins;
  if (filter === "all") displayCabins = cabins;
  else if (filter === "small")
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  else if (filter === "medium")
    displayCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  else if (filter === "large")
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <>
      {cabins.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
          {displayCabins.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
          ))}
        </div>
      )}
    </>
  );
}

export default CabinList;
