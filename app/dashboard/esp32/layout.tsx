"use client";

import { useAppDispatch } from "@/hooks/reduxHook";
import { AddEsp32Details } from "@/store/esp32/Esp32Slice";

import { useEffect, useState } from "react";
// import { socket } from "../socket";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket } from "../websocket";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFetchingEsp32details, setIsFetchingEsp32details] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const dispatch = useAppDispatch();

  /////// Socket.IO ///////
  // useEffect(() => {
  //   try {
  //     setIsFetchingEsp32details(true);
  //     socket.emit("esp32_details")
  //     console.log("Fetch Esp32 Details event emitted");
  //   } catch (error) {
  //     console.log("Fetch Esp32 Details failed", error);
  //   } finally {
  //     setTimeout(() => {
  //       setIsFetchingEsp32details(false);
  //     }, 7000);
  //   }
  // }, []);

  // useEffect(() => {
  //   // Listen for esp_details feedback from the server
  //   socket.on("esp32_feedback", (feedback: any) => {
  //     console.log("Esp32 Details feedback received:", feedback);
  //     setIsFetchingEsp32details(false);
  //     if (feedback.error) {
  //       setErrorMessage(`Failed to fetch Esp32 Details`);
  //     } else {
  //       setSuccessMessage(feedback.message);
  //       dispatch(AddEsp32Details(feedback.esp32));
  //     }
  //     setTimeout(() => {
  //       setErrorMessage("");
  //       setSuccessMessage("");
  //     }, 7000);
  //   });

  //   // Clean up event listener when component unmounts
  //   return () => {
  //     socket.off("esp32_feedback");
  //   };
  // }, []);

  /////// Websocket ///////
  const socket = getWebSocket();

  useEffect(() => {
    const fetchEsp32Details = () => {
      try {
        setIsFetchingEsp32details(true);
        socket?.send(JSON.stringify({ event: "esp32_details" }));
        console.log("Fetch Esp32 Details event emitted");
      } catch (error) {
        console.log("Fetch Esp32 Details failed", error);
      } finally {
        setTimeout(() => {
          setIsFetchingEsp32details(false);
        }, 7000);
      }
    };

    // Call fetchEsp32Details when the component mounts
    fetchEsp32Details();
  }, []);

  useEffect(() => {
    const handleEsp32Feedback = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("Esp32 Details feedback received:", data);
      setIsFetchingEsp32details(false);
      if (data.error) {
        setErrorMessage("Failed to fetch Esp32 Details");
      } else {
        setSuccessMessage(data.message);
        dispatch(AddEsp32Details(data.esp32));
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
    };

    // Listen for esp_details feedback from the server
    socket?.addEventListener("message", handleEsp32Feedback);

    // Clean up event listener when component unmounts
    return () => {
      socket?.removeEventListener("message", handleEsp32Feedback);
    };
  }, []);

  return (
    <>
      <h2 className="courses-header">Esp32 Details</h2>
      {isFetchingEsp32details === true ? (
        <LoadingSpinner color="blue" height="big" />
      ) : (
        <div> {children}</div>
      )}
    </>
  );
}
