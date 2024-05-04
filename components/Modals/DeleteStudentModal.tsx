import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import HttpRequest from "@/store/services/HttpRequest";

interface DeleteStudentModalProps {
  courseCode: string | null;
  studentMatricNo: string;
  closeModal: () => void;
}

interface FormValuesType {
  matricNo: string;
}

const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  courseCode,
  studentMatricNo,
  closeModal,
}) => {
  const [isDeleteStudentting, setIsDeleteStudentting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik<FormValuesType>({
    initialValues: {
      matricNo: "",
    },
    validationSchema: Yup.object().shape({
      matricNo: Yup.string()
        .required("Matric No is required")
        .matches(
          new RegExp(studentMatricNo),
          "Matric No must matched that of the intended student own"
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      if (values.matricNo !== studentMatricNo) {
        setErrorMessage(
          "Matric No must matched that of the intended student own"
        );
        return;
      }
      try {
        setIsDeleteStudentting(true);
        const response = await HttpRequest.delete(
          `/courses/${courseCode}/disenroll/${studentMatricNo}`
        );
        console.log("Student has been disenrolled for this course", response);
        setSuccessMessage(
          `Student with ${studentMatricNo} has been disenrolled successfuly`
        );
        // Reset formData and close modal after enroll_feedback
        formik.resetForm();
        closeModal();
      } catch (error) {
        console.error("Failed to disenrolled:", error);
        setErrorMessage("Failed to disenrolled. Try again!");
      } finally {
        setIsDeleteStudentting(false);
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
        This action will disenroll the student with the matriculation number{" "}
        {studentMatricNo}.
      </h2>
      <h3 className="resetOverlay-text_2">
        If you wish to continue, enter <span>{studentMatricNo}</span> in the
        field below
      </h3>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="matricNo"
          type="text"
          name="matricNo"
          value={formik.values.matricNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.matricNo}
          placeholder="e.g ABC 123"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <button
          className="resetOverlay-button"
          type="submit"
          disabled={isDeleteStudentting || !formik.isValid}
        >
          {isDeleteStudentting ? "Disenrolling..." : "Disenroll"}
        </button>
      </form>
    </div>
  );
};
export default DeleteStudentModal;
