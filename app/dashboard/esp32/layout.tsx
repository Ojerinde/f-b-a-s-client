"use client";

import { useAppDispatch } from "@/hooks/reduxHook";
import { AddEsp32Details } from "@/store/esp32/Esp32Slice";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { initializeWebSocket } from "../websocket";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFetchingEsp32details, setIsFetchingEsp32details] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  // Initialize WebSocket connection
  const socket = initializeWebSocket();

  const dispatch = useAppDispatch();

  const fetchEsp32Details = () => {
    try {
      setIsFetchingEsp32details(true);
      socket?.send(JSON.stringify({ event: "esp32_data_request" }));
      console.log("Fetch Esp32 Details event emitted");
    } catch (error) {
      console.log("Fetch Esp32 Details failed", error);
    } finally {
      setTimeout(() => {
        setIsFetchingEsp32details(false);
      }, 10000);
    }
  };

  useEffect(() => {
    const handleEsp32Feedback = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      if (data.event !== "esp32_data_feedback") return;

      console.log("Esp32 Details feedback received:", data);

      setIsFetchingEsp32details(false);
      if (data.error) {
        setErrorMessage("Failed to fetch Esp32 Details");
      } else {
        setSuccessMessage(data.payload);
        dispatch(AddEsp32Details(data.payload));
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
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
  }, [dispatch]);

  return (
    <>
      <div className="esp32Page-header">
        <h2 className="courses-header">Esp32 Details</h2>
        <button
          className="coursePage-back text-[2rem]"
          disabled={isFetchingEsp32details === true}
          onClick={fetchEsp32Details}
        >
          Refresh
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
