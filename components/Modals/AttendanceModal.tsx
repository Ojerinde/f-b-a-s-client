import { Course } from "@/app/dashboard/my_courses/page";
import { toast } from "react-toastify";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
// import { socket } from "@/app/dashboard/socket";
import { MdOutlineClose } from "react-icons/md";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";

interface AttendanceModalProps {
  course: Course | null;
  closeModal: () => void;
}
const AttendanceModal: React.FC<AttendanceModalProps> = ({
  course,
  closeModal,
}) => {
  const [takingAttendanceIsLoading, setTakingAttendanceIsLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    initializeWebSocket();
  }, []);

  const downloadHandler = async () => {
    try {
      setTakingAttendanceIsLoading(true);
      // Emit the attendance event to the server
      const socket = getWebSocket();
      socket?.send(
        JSON.stringify({ event: "attendance", payload: { ...course } })
      );
      console.log("Attendance event emitted");
    } catch (error) {
      console.error("Error emitting attendance event:", error);
      setTakingAttendanceIsLoading(false);
      setErrorMessage("Failed to mark attendance. Try again!");
    } finally {
      setTimeout(() => {
        setErrorMessage("");
      }, 7000);
    }
  };

  useEffect(() => {
    const socket = getWebSocket();
    // Listen for attendance feedback from the server
    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      if (feedback.event !== "attendance_feedback") return;
      console.log("Attendance feedback received:", feedback);
      setTakingAttendanceIsLoading(false);
      if (feedback.payload.error) {
        setErrorMessage(feedback.payload.message);
      } else {
        setSuccessMessage(feedback.payload.message);
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
    };

    // Add event listener for attendance feedback
    socket?.addEventListener("message", handleAttendanceFeedback);

    // Clean up event listener when component unmounts
    return () => {
      socket?.removeEventListener("message", handleAttendanceFeedback);
    };
  }, []);

  useEffect(() => {
    const socket = getWebSocket();
    // Listen for attendance recorded event from the server
    const handleAttendanceRecorded = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      toast(feedback.payload.message, {
        position: "top-right",
        autoClose: false,
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
    };

    // Add event listener for attendance recorded event
    socket?.addEventListener("message", handleAttendanceRecorded);

    // Clean up event listener when component unmounts
    return () => {
      socket?.removeEventListener("message", handleAttendanceRecorded);
    };
  }, []);
  return (
    <div className="attendanceOverlay">
      <div className="" onClick={closeModal}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2 className="attendanceOverlay-text">
        Click the button below to download {course?.courseCode} attendance sheet
        to the device.
      </h2>
      {errorMessage && <p className="signup-error">{errorMessage}</p>}
      {successMessage && <p className="signup-success">{successMessage}</p>}
      <p style={{ marginBottom: "1rem" }}>
        {takingAttendanceIsLoading && <LoadingSpinner color="blue" />}
      </p>

      <Button
        type="submit"
        disabled={takingAttendanceIsLoading}
        onClick={() => {
          downloadHandler();
        }}
      >
        {takingAttendanceIsLoading
          ? "Downloading Attendance Sheet..."
          : "Download Attendance Sheet"}
      </Button>
    </div>
  );
};
export default AttendanceModal;
