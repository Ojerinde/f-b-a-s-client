"use client";
import { useAppSelector } from "@/hooks/reduxHook";
import { AiOutlinePercentage } from "react-icons/ai";
import { FaChargingStation, FaChartPie } from "react-icons/fa";
import { GrCapacity } from "react-icons/gr";
import {
  MdOtherHouses,
  MdSignalWifiStatusbarNotConnected,
} from "react-icons/md";
import { PiFingerprintBold } from "react-icons/pi";
const Esp32 = () => {
  const { esp32 } = useAppSelector((state) => state.esp32);
  console.log("Esp32 details", esp32);

  return (
    <div className="esp32Page">
      <ul className="esp32Page-box">
        <div className="esp32Page-box__item">
          <GrCapacity />
          <p>Battery Capacity</p>
          <h4>{esp32.batteryCapacity}</h4>
        </div>
        <div className="esp32Page-box__item">
          <AiOutlinePercentage />
          <p>Battery Percentage</p>
          <h4>{esp32.batteryPercentage}</h4>
        </div>
        <div className="esp32Page-box__item">
          <MdSignalWifiStatusbarNotConnected />
          <p>Connected to internet?</p>
          <h4>{esp32.isConnectedToInternet ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          <PiFingerprintBold />
          <p>Fingerprint Sensor Active?</p>
          <h4>{esp32.isFingerprintActive ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          <FaChargingStation />
          <p>Device Charging?</p>
          <h4>{esp32.isCharging ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          <MdOtherHouses />
          <p>Other Details</p>
          <h4>Others</h4>
        </div>
      </ul>
    </div>
  );
};
export default Esp32;
