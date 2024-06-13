import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import InformationInput from "../UI/Input/InformationInput";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";

interface EnrollmentModalProps {
  course: Course | null;
  lecturerEmail: string;
  closeModal: () => void;
}

interface FormValuesType {
  name: string;
  matricNo: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  course,
  lecturerEmail,
  closeModal,
}) => {
  const [enrollmentIsLoading, setEnrollmentIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    initializeWebSocket();
  }, []);

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: "",
      matricNo: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Name is required")
        .matches(
          /^[A-Za-z]+\s[A-Za-z]+$/,
          "Please enter your full name with a space between first and last name"
        ),
      matricNo: Yup.string()
        .required("Matriculation number is required")
        .matches(
          /^\d{2}\/\d{2}[A-Z]{2}\d{3}$/,
          "Matriculation number must be in the format 18/30GC056"
        ),
    }),

    onSubmit: async (values, actions) => {
      try {
        initializeWebSocket();
        const socket = getWebSocket();

        setEnrollmentIsLoading(true);
        // Emit the enroll event to the server
        socket?.send(
          JSON.stringify({
            event: "enroll",
            payload: { ...values, ...course, lecturerEmail },
          })
        );
        console.log("Enroll event emitted");
      } catch (error) {
        console.error("Error emitting enroll event:", error);
        setEnrollmentIsLoading(false);
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

    // Define a separate function to handle enrollment feedback
    const handleEnrollmentFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);

      if (feedback.event !== "enroll_feedback") return;

      console.log("Enrollment feedback received:", feedback);
      formik.resetForm();
      setEnrollmentIsLoading(false);

      if (feedback.payload.error) {
        setErrorMessage(feedback.payload.message);
      } else {
        setSuccessMessage(feedback.payload.message);
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
    };

    // Add event listener for enrollment feedback
    socket?.addEventListener("message", handleEnrollmentFeedback);

    // Clean up event listener when component unmounts
    return () => {
      socket?.removeEventListener("message", handleEnrollmentFeedback);
    };
  }, []);

  return (
    <div className="enrollmentOverlay">
      <div className="" onClick={closeModal}>
        <MdOutlineClose className="enrollmentOverlay-icon" />
      </div>
      <h2 className="enrollmentOverlay-text">
        Enroll Student for {course?.courseCode}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="name"
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.name}
          invalid={!!formik.errors.name && formik.touched.name}
          placeholder="E.g Ojerinde Joel"
        />

        <InformationInput
          id="matricNo"
          type="matricNo"
          name="matricNo"
          value={formik.values.matricNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.matricNo}
          invalid={!!formik.errors.matricNo && formik.touched.matricNo}
          placeholder="E.g 18/30GC056"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button type="submit" disabled={enrollmentIsLoading || !formik.isValid}>
          {enrollmentIsLoading ? "Enrolling..." : "Enroll"}
        </Button>
      </form>
    </div>
  );
};
export default EnrollmentModal;
