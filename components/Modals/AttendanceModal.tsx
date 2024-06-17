import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import { toast } from "react-toastify";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";
import InformationInput from "../UI/Input/InformationInput";
import { start } from "repl";

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
  const [scheduledStartTime, setScheduledStartTime] = useState<Date | null>(
    null
  );
  const [scheduledEndTime, setScheduledEndTime] = useState<Date | null>(null);

  useEffect(() => {
    initializeWebSocket();
  }, []);

  interface FormValuesType {
    startTime: string;
    endTime: string;
  }

  const formik = useFormik<FormValuesType>({
    initialValues: {
      startTime: "",
      endTime: "",
    },
    validationSchema: Yup.object().shape({
      startTime: Yup.string()
        .required("Start time is required")
        .test(
          "is-later-than-current-time",
          "Start time must be later than the current time",
          function (value) {
            const currentTime = new Date();
            const [hours, minutes] = value.split(":").map(Number);
            const inputTime = new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate(),
              hours,
              minutes
            );
            return inputTime.getTime() > currentTime.getTime();
          }
        ),
      endTime: Yup.string()
        .required("End time is required")
        .test(
          "is-greater",
          "End time must be later than start time",
          function (value) {
            const { startTime } = this.parent;
            if (!startTime || !value) return true;
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            const [endHours, endMinutes] = value.split(":").map(Number);
            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;
            return endTotalMinutes > startTotalMinutes;
          }
        ),
    }),
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: async (values, actions) => {
      try {
        // initializeWebSocket();
        // const socket = getWebSocket();

        const getLagosTime = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);
          let lagosHours = hours;

          // Handle 12-hour format conversion
          if (time.includes("PM") && hours !== 12) {
            lagosHours += 12;
          } else if (time.includes("AM") && hours === 12) {
            lagosHours = 0;
          }

          const utcTime = new Date(
            Date.UTC(
              new Date().getUTCFullYear(),
              new Date().getUTCMonth(),
              new Date().getUTCDate(),
              lagosHours,
              minutes
            )
          );

          return utcTime.toISOString();
        };

        const lagosStartTime = getLagosTime(values.startTime);
        const lagosEndTime = getLagosTime(values.endTime);

        // Convert lagosStartTime to a Date object and store it in state
        setScheduledStartTime(new Date(lagosStartTime));
        setScheduledEndTime(new Date(lagosEndTime));

        setTakingAttendanceIsLoading(true);
        setSuccessMessage(
          "Attendance has been scheduled successfully! between " +
            values.startTime +
            " and " +
            values.endTime
        );
        setTakingAttendanceIsLoading(false);

        // // Emit the enroll event to the server
        // socket?.send(
        //   JSON.stringify({
        //     event: "attendance",
        //     payload: {
        //       startTime: lagosStartTime,
        //       endTime: lagosEndTime,
        //       ...course,
        //     },
        //   })
        // );
      } catch (error) {
        setTakingAttendanceIsLoading(false);
        setErrorMessage("Failed to mark attendance. Try again!");
      } finally {
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 7000);
      }
    },
  });

  useEffect(() => {
    initializeWebSocket();
    const socket = getWebSocket();

    const interval = setInterval(() => {
      const currentTime = new Date();
      if (scheduledStartTime && currentTime >= scheduledStartTime) {
        socket?.send(
          JSON.stringify({
            event: "attendance",
            payload: {
              startTime: scheduledStartTime.toISOString(),
              endTime: scheduledEndTime?.toISOString(),
              ...course,
            },
          })
        );
        console.log(
          "Attendance marked",
          scheduledEndTime?.toISOString(),
          scheduledStartTime?.toISOString()
        );
        clearInterval(interval);
      }
    }, 60000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [scheduledStartTime, scheduledEndTime, course]);

  useEffect(() => {
    const socket = getWebSocket();
    // Listen for attendance feedback from the server
    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      if (feedback.event !== "attendance_feedback") return;
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
        Schedule Attendance for {course?.courseCode}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="startTime"
          type="time"
          name="startTime"
          value={formik.values.startTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!formik.errors.startTime && formik.touched.startTime}
          inputErrorMessage={formik.errors.startTime}
        />
        <InformationInput
          id="endTime"
          type="time"
          name="endTime"
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!formik.errors.endTime && formik.touched.endTime}
          inputErrorMessage={formik.errors.endTime}
        />

        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button
          type="submit"
          disabled={takingAttendanceIsLoading || !formik.isValid}
        >
          {takingAttendanceIsLoading
            ? "Downloading Course Data..."
            : "Schedule Attendance"}
        </Button>
      </form>
    </div>
  );
};

export default AttendanceModal;
