import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import { toast } from "react-toastify";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
// import { socket } from "@/app/dashboard/socket";
import { MdOutlineClose } from "react-icons/md";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";
import InformationInput from "../UI/Input/InformationInput";

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

  interface FormValuesType {
    time: string;
  }

  const formik = useFormik<FormValuesType>({
    initialValues: {
      time: "",
    },
    validationSchema: Yup.object().shape({
      time: Yup.string()
        .required("Time is required")
        .matches(
          /^([0-9]|[1-9][0-9]):[0-5][0-9]$/,
          "Time must be in the format HH:MM"
        ),
    }),
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: async (values, actions) => {
      try {
        const socket = getWebSocket();

        setTakingAttendanceIsLoading(true);
        // Emit the enroll event to the server
        socket?.send(
          JSON.stringify({
            event: "attendance",
            payload: { ...values, ...course },
          })
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
    },
  });

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
      <h2 className="enrollmentOverlay-text">
        Take Attendance for {course?.courseCode}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="time"
          type="text"
          name="time"
          value={formik.values.time}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!formik.errors.time && formik.touched.time}
          inputErrorMessage={formik.errors.time}
          placeholder="E.g 1:00"
        />

        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button
          type="submit"
          disabled={takingAttendanceIsLoading || !formik.isValid}
        >
          {takingAttendanceIsLoading
            ? "Downloading Course Data..."
            : "Take Attendance"}
        </Button>
      </form>
    </div>
  );
};
export default AttendanceModal;
