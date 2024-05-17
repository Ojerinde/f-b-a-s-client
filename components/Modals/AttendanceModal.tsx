import { Course } from "@/app/dashboard/my_courses/page";
import { toast } from "react-toastify";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
// import { socket } from "@/app/dashboard/socket";
import { MdOutlineClose } from "react-icons/md";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket } from "@/app/dashboard/websocket";

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

  /////// Socket.IO ///////
  // const downloadHandler = async () => {
  //   try {
  //     setTakingAttendanceIsLoading(true);
  //     // Emit the enroll event to the server
  //     socket.emit("attendance", {
  //       ...course,
  //     });

  //     console.log("Attendance event emitted");
  //     // Reset formData and close modal after enroll_feedback
  //   } catch (error) {
  //     console.error("Error emitting enroll event:", error);
  //     setTakingAttendanceIsLoading(false);
  //     setErrorMessage("Failed to mark attendance. Try again!");
  //   } finally {
  //     setTimeout(() => {
  //       setErrorMessage("");
  //     }, 7000);
  //   }
  // };

  // useEffect(() => {
  //   // Listen for attendance feedback from the server
  //   socket.on("attendance_feedback", (feedback) => {
  //     console.log("Attendance feedback received:", feedback);
  //     setTakingAttendanceIsLoading(false);
  //     if (feedback.error) {
  //       setErrorMessage(`${feedback.message}`);
  //     } else {
  //       setSuccessMessage(feedback.message);
  //     }
  //     setTimeout(() => {
  //       setErrorMessage("");
  //       setSuccessMessage("");
  //     }, 5000);
  //   });

  //   // Clean up event listener when component unmounts
  //   return () => {
  //     socket.off("attendance_feedback");
  //   };
  // }, []);

  // useEffect(() => {
  //   // Listen for attendance feedback from the server
  //   socket.on("attendance_recorded", (feedback) => {
  //     toast(feedback.message, {
  //       position: "top-right",
  //       autoClose: false,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //       style: {
  //         background: "#181a40",
  //         color: "white",
  //         fontSize: "1.7rem",
  //         fontFamily: "Poetsen One",
  //         letterSpacing: "0.15rem",
  //         lineHeight: "1.7",
  //         padding: "1rem",
  //       },
  //     });
  //   });

  //   // Clean up event listener when component unmounts
  //   return () => {
  //     socket.off("attendance_record");
  //   };
  // }, []);

  // /////// Websocket ///////
  const socket = getWebSocket();

  const downloadHandler = async () => {
    try {
      setTakingAttendanceIsLoading(true);
      // Emit the attendance event to the server
      socket.send(JSON.stringify({ event: "attendance", data: { ...course } }));
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
    // Listen for attendance feedback from the server
    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      console.log("Attendance feedback received:", feedback);
      setTakingAttendanceIsLoading(false);
      if (feedback.error) {
        setErrorMessage(`${feedback.message}`);
      } else {
        setSuccessMessage(feedback.message);
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
    };

    // Add event listener for attendance feedback
    socket.addEventListener("message", handleAttendanceFeedback);

    // Clean up event listener when component unmounts
    return () => {
      socket.removeEventListener("message", handleAttendanceFeedback);
    };
  }, []);

  useEffect(() => {
    // Listen for attendance recorded event from the server
    const handleAttendanceRecorded = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      toast(feedback.message, {
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
    socket.addEventListener("message", handleAttendanceRecorded);

    // Clean up event listener when component unmounts
    return () => {
      socket.removeEventListener("message", handleAttendanceRecorded);
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
      {takingAttendanceIsLoading && (
        <LoadingSpinner height="big" color="blue" />
      )}

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
