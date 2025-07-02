"use client";
import { createContext, useState, useContext } from "react";

const ReservationContext = createContext();
const initialValue = { from: null, to: null };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialValue);
  const resetRange = () => setRange(initialValue);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context is using outside of its provider");
  return context;
}

export { useReservation, ReservationProvider };
