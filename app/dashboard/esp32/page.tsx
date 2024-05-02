"use client";
import { useAppSelector } from "@/hooks/reduxHook";

const Esp32 = () => {
  const { esp32 } = useAppSelector((state) => state.esp32);
  console.log("Esp32 details", esp32);

  return <div>esp32</div>;
};
export default Esp32;
