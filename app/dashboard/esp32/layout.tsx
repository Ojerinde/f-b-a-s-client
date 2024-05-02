"use client";

import { useAppDispatch } from "@/hooks/reduxHook";
import { AddEsp32Details } from "@/store/esp32/Esp32Slice";
import HttpRequest from "@/store/services/HttpRequest";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

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

  useEffect(() => {
    setIsFetchingEsp32details(true);
    socket.emit("esp32_details");
    console.log("Fetch Esp32 Details event emitted");
  }, []);

  useEffect(() => {
    // Listen for esp_details feedback from the server
    socket.on("esp32_feedback", (feedback: any) => {
      console.log("Esp32 Details feedback received:", feedback);
      setIsFetchingEsp32details(false);
      if (feedback.error) {
        setErrorMessage(`Failed to fetch Esp32 Details`);
      } else {
        setSuccessMessage(feedback.message);
        dispatch(AddEsp32Details(feedback.esp32));
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("esp32_feedback");
    };
  }, []);

  return (
    <div>
      <h2 className="courses-header">Esp32 </h2>
      {isFetchingEsp32details === true ? (
        <LoadingSpinner color="blue" height="big" />
      ) : (
        <div> {children}</div>
      )}
    </div>
  );
}
