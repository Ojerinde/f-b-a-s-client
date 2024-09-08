"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { AddEsp32Details } from "@/store/esp32/Esp32Slice";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket } from "../websocket";
import { emitToastMessage } from "@/utils/toastFunc";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFetchingEsp32details, setIsFetchingEsp32details] =
    useState<boolean>(false);
  const { esp32 } = useAppSelector((state) => state.esp32);

  const dispatch = useAppDispatch();

  const fetchEsp32Details = () => {
    try {
      const socket = getWebSocket();
      // First confirm the device data
      const deviceData = GetItemFromLocalStorage("deviceData");

      if (!deviceData || !deviceData.email || !deviceData.deviceLocation) {
        emitToastMessage(
          "Device location not found. Please go to the settings page to set up the location of the device to communicate with.",
          "error"
        );
        return;
      }

      setIsFetchingEsp32details(true);
      socket?.send(
        JSON.stringify({ event: "esp32_data", payload: { deviceData } })
      );
    } catch (error) {
      emitToastMessage("Failed to emit event to fetch device data", "error");
    } finally {
      setTimeout(() => {
        setIsFetchingEsp32details(false);
      }, 10000);
    }
  };

  useEffect(() => {
    const deviceData = GetItemFromLocalStorage("deviceData");
    if (deviceData) return;
    if (!esp32.batteryCapacity) {
      fetchEsp32Details();
    }
  }, []);

  useEffect(() => {
    const socket = getWebSocket();

    const handleEsp32Feedback = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.event !== "esp32_data_feedback") return;

      setIsFetchingEsp32details(false);
      if (data.payload.error) {
        emitToastMessage("Failed to fetch device data", "error");
      } else {
        emitToastMessage("Device data fetched successfully", "success");
        dispatch(AddEsp32Details(data.payload.data));
      }
    };

    if (socket) {
      socket.addEventListener("message", handleEsp32Feedback);
    }

    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.removeEventListener("message", handleEsp32Feedback);
      }
    };
  }, []);

  return (
    <>
      <div className="esp32Page-header">
        <h2 className="courses-header">Device Details</h2>
        <button
          className="coursePage-back text-[2rem]"
          disabled={isFetchingEsp32details === true}
          onClick={fetchEsp32Details}
        >
          Fetch
        </button>
      </div>

      {isFetchingEsp32details === true ? (
        <LoadingSpinner color="blue" height="big" />
      ) : (
        <div> {children}</div>
      )}
    </>
  );
}
