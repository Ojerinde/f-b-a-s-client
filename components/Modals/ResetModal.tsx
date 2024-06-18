import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import InformationInput from "../UI/Input/InformationInput";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import HttpRequest from "@/store/services/HttpRequest";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";

interface ResetModalProps {
  course: Course | null;
  closeModal: () => void;
}

interface FormValuesType {
  courseCode: string;
}

const ResetModal: React.FC<ResetModalProps> = ({ course, closeModal }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik<FormValuesType>({
    initialValues: {
      courseCode: "",
    },
    validationSchema: Yup.object().shape({
      courseCode: Yup.string()
        .required("Course Code is required")
        .matches(/^[A-Z]{3} \d{3}$/, "Course must be in the format 'XXX 000'"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      try {
        setIsResetting(true);
        const response = await HttpRequest.delete(
          `/courses/${values?.courseCode}/reset`
        );

        initializeWebSocket();
        const socket = getWebSocket();

        // Function to emit delete_fingerprint event
        const emitDeleteFingerprintEvent = (matricNo: string) => {
          socket?.send(
            JSON.stringify({
              event: "delete_fingerprint",
              payload: {
                matricNo,
                courseCode: response.data.courseCode,
              },
            })
          );
        };

        // Emit delete_fingerprint event for each student with a 20-second interval
        const students = response.data.students;
        students.forEach((student: any, index: number) => {
          setTimeout(() => {
            emitDeleteFingerprintEvent(student.matricNo);
          }, index * 20000);
        });

        setSuccessMessage(response.data.message);
        // Reset formData and close modal after enroll_feedback
        formik.resetForm();
      } catch (error) {
        setErrorMessage("Failed to reset course. Try again!");
      } finally {
        setIsResetting(false);
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 7000);
      }
    },
  });

  return (
    <div className="resetOverlay">
      <div className="" onClick={closeModal}>
        <MdOutlineClose className="resetOverlay-icon" />
      </div>
      <h2 className="resetOverlay-text">
        This action will remove all enrolled students and attendance records for
        the course with the code {course?.courseCode}.
      </h2>
      <h3 className="resetOverlay-text_2">
        If you wish to continue, enter <span>{course?.courseCode}</span> in the
        field below
      </h3>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="courseCode"
          type="text"
          name="courseCode"
          value={formik.values.courseCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.courseCode}
          placeholder="e.g ABC 123"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <button
          className="resetOverlay-button"
          type="submit"
          disabled={isResetting || !formik.isValid}
        >
          {isResetting ? "Resetting..." : "Reset"}
        </button>
      </form>
    </div>
  );
};
export default ResetModal;
