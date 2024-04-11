import { useFormik } from "formik";
import * as Yup from "yup";
import { Course } from "@/app/dashboard/my_courses/page";
import InformationInput from "../UI/Input/InformationInput";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { socket } from "@/app/dashboard/socket";
import { MdOutlineClose } from "react-icons/md";

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

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: "",
      matricNo: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      matricNo: Yup.string().required("Matric No is required"),
    }),

    onSubmit: async (values, actions) => {
      try {
        setEnrollmentIsLoading(true);
        // Emit the enroll event to the server
        socket.emit("enroll", {
          ...values,
          ...course,
          lecturerEmail,
        });
        console.log("Enroll event emitted");
        // Reset formData and close modal after enroll_feedback
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
    // Listen for enrollment feedback from the server
    socket.on("enroll_feedback", (feedback) => {
      console.log("Enrollment feedback received:", feedback);
      formik.resetForm();
      setEnrollmentIsLoading(false); // Set loading to false once feedback is received
      if (feedback.error) {
        setErrorMessage(`${feedback.message}`);
      } else {
        setSuccessMessage(feedback.message);
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("enroll_feedback");
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
          placeholder="E.g 18/30GC056"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button type="submit" disabled={enrollmentIsLoading}>
          {enrollmentIsLoading ? "Enrolling..." : "Enroll"}
        </Button>
      </form>
    </div>
  );
};
export default EnrollmentModal;
