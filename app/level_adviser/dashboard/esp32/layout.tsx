"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { AddEsp32Details } from "@/store/esp32/Esp32Slice";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket, initializeWebSocket } from "../websocket";
import { toast } from "react-toastify";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFetchingEsp32details, setIsFetchingEsp32details] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { esp32 } = useAppSelector((state) => state.esp32);

  // Initialize WebSocket connection
  initializeWebSocket();

  const dispatch = useAppDispatch();

  const fetchEsp32Details = () => {
    try {
      const socket = getWebSocket();
      setIsFetchingEsp32details(true);
      socket?.send(JSON.stringify({ event: "esp32_data" }));
    } catch (error) {
      toast("Failed to emit event to fetch ESP32 data", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "black",
        style: {
          background: "#181a40",
          color: "white",
          fontSize: "1.7rem",
          fontFamily: "Poetsen One",
          letterSpacing: "0.15rem",
          lineHeight: "1.7",
          padding: "1rem",
        },
      });
    } finally {
      setTimeout(() => {
        setIsFetchingEsp32details(false);
      }, 10000);
    }
  };

  useEffect(() => {
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
        toast("Failed to fetch Esp32 data", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "black",
          style: {
            background: "orangered",
            color: "white",
            fontSize: "1.7rem",
            fontFamily: "Poetsen One",
            letterSpacing: "0.15rem",
            lineHeight: "1.7",
            padding: "1rem",
          },
        });
      } else {
        toast("Esp32 data fetched successfully", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: "#181a40",
            color: "white",
            fontSize: "1.7rem",
            fontFamily: "Poetsen One",
            letterSpacing: "0.15rem",
            lineHeight: "1.7",
            padding: "1rem",
          },
        });
        dispatch(AddEsp32Details(data.payload.data));
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
  }, []);

  return (
    <>
      <div className="esp32Page-header">
        <h2 className="courses-header">Esp32 Details</h2>
        <button
          className="coursePage-back text-[2rem]"
          disabled={isFetchingEsp32details === true}
          onClick={fetchEsp32Details}
        >
          Refetch Details
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
