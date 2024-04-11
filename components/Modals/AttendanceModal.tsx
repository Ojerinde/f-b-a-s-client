import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import InformationInput from "../UI/Input/InformationInput";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { socket } from "@/app/dashboard/socket";
import { MdOutlineClose } from "react-icons/md";

interface AttendanceModalProps {
  course: Course | null;
  closeModal: () => void;
}

interface FormValuesType {
  matricNo: string;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  course,
  closeModal,
}) => {
  const [takingAttendanceIsLoading, setTakingAttendanceIsLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik<FormValuesType>({
    initialValues: {
      matricNo: "",
    },
    validationSchema: Yup.object().shape({
      matricNo: Yup.string().required("Matric No is required"),
    }),

    onSubmit: async (values, actions) => {
      try {
        setTakingAttendanceIsLoading(true);
        // Emit the enroll event to the server
        socket.emit("attendance", {
          ...values,
          ...course,
        });
        console.log("Attendance event emitted");
        // Reset formData and close modal after enroll_feedback
      } catch (error) {
        console.error("Error emitting enroll event:", error);
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
    // Listen for attendance feedback from the server
    socket.on("attendance_feedback", (feedback) => {
      console.log("Attendance feedback received:", feedback);
      formik.resetForm();
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
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("attendance_feedback");
    };
  }, []);
  return (
    <div className="attendanceOverlay">
      <div className="" onClick={closeModal}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2 className="attendanceOverlay-text">
        Take Attendance for {course?.courseCode}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="matricNo"
          type="matricNo"
          name="matricNo"
          value={formik.values.matricNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.matricNo}
          placeholder="E.g 18/30GC056"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button type="submit" disabled={takingAttendanceIsLoading}>
          {takingAttendanceIsLoading ? "Submitting..." : "Mark Attendance"}
        </Button>
      </form>
    </div>
  );
};
export default AttendanceModal;
