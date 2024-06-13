"use client";
import { useAppSelector } from "@/hooks/reduxHook";
import { AiOutlinePercentage } from "react-icons/ai";
import {
  FaBatteryFull,
  FaChargingStation,
  FaChartPie,
  FaWifi,
} from "react-icons/fa";
import { GrCapacity } from "react-icons/gr";
import { IoMdBatteryCharging } from "react-icons/io";
import {
  MdOtherHouses,
  MdSignalWifiStatusbarNotConnected,
} from "react-icons/md";
import { PiFingerprintBold } from "react-icons/pi";

const Esp32 = () => {
  const { esp32 } = useAppSelector((state) => state.esp32);

  return (
    <div className="esp32Page">
      <ul className="esp32Page-box">
        <div className="esp32Page-box__item">
          {esp32?.batteryCapacity >= "3.7" ? <FaBatteryFull /> : <GrCapacity />}

          <p>Battery Capacity</p>
          <h4>{esp32?.batteryCapacity || 0}</h4>
        </div>
        <div className="esp32Page-box__item">
          <AiOutlinePercentage />
          <p>Battery Percentage</p>
          <h4>{esp32?.batteryPercentage || 0}</h4>
        </div>
        <div className="esp32Page-box__item">
          {!esp32?.isConnectedToInternet ? (
            <MdSignalWifiStatusbarNotConnected />
          ) : (
            <FaWifi />
          )}
          <p>Connected to internet?</p>
          <h4>{esp32?.isConnectedToInternet ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          <PiFingerprintBold />
          <p>Fingerprint Sensor Active?</p>
          <h4>{esp32?.isFingerprintActive ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          {esp32?.isCharging ? <IoMdBatteryCharging /> : <FaChargingStation />}
          <p>Device Charging?</p>
          <h4>{esp32?.isCharging ? "True" : "False"}</h4>
        </div>
        <div className="esp32Page-box__item">
          <MdOtherHouses />
          <p>Device Location</p>
          <h4>{esp32?.location || "No Data"}</h4>
        </div>
      </ul>
    </div>
  );
};
export default Esp32;
