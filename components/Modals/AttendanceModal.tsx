import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";
import InformationInput from "../UI/Input/InformationInput";
import { emitToastMessage } from "@/utils/toastFunc";

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
        initializeWebSocket();
        const socket = getWebSocket();

        const convertToLagosTime = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);
          const currentTime = new Date();
          const lagosTime = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            hours,
            minutes
          );
          lagosTime.setTime(lagosTime.getTime() + 3600000); // GMT+1 offset
          return lagosTime;
        };

        const lagosStartTime = convertToLagosTime(values.startTime);
        const lagosEndTime = convertToLagosTime(values.endTime);

        socket?.send(
          JSON.stringify({
            event: "attendance",
            payload: {
              ...course,
              startTime: lagosStartTime,
              endTime: lagosEndTime,
            },
          })
        );

        setTimeout(() => {
          closeModal();
        }, 7000);
      } catch (error) {
        setErrorMessage("Failed to schedule attendance. Try again!");
      } finally {
        setTakingAttendanceIsLoading(false);
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
          // closeModal();
        }, 7000);
      }
    },
  });

  useEffect(() => {
    const socket = getWebSocket();

    // Define a separate function to handle enrollment feedback
    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);

      if (feedback.event !== "attendance_feedback") return;

      formik.resetForm();
      setTakingAttendanceIsLoading(false);

      if (feedback.payload.error) {
        setSuccessMessage("");

        setErrorMessage(feedback.payload.message);
        emitToastMessage(feedback.payload.message, 'error')
      } else {
        setErrorMessage("");
        setSuccessMessage(feedback.payload.message);
        emitToastMessage(feedback.payload.message, 'success')
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 10000);
    };

    // Add event listener for enrollment feedback
    socket?.addEventListener("message", handleAttendanceFeedback);

    // Clean up event listener when component unmounts
    return () => {
      socket?.removeEventListener("message", handleAttendanceFeedback);
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
            ? "Scheduling Attendance..."
            : "Schedule Attendance"}
        </Button>
      </form>
    </div>
  );
};

export default AttendanceModal;
