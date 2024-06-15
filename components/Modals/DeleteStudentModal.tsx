import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import HttpRequest from "@/store/services/HttpRequest";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHook";
import { AddEnrolledStudents } from "@/store/studentss/StudentsSlice";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";
import { toast } from "react-toastify";

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

  const router = useRouter();
  const dispatch = useAppDispatch();

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
        initializeWebSocket();
        const response = await HttpRequest.delete(
          `/courses/${courseCode}/disenroll/${studentMatricNo.replace(
            "/",
            "_"
          )}`
        );
        if (response.data.pendingRemoval) {
          setSuccessMessage(
            `Student with ${response.data.matricNo} is not enrolled for any other course. This will cause the deletion of the student fingerprint template on the sensor`
          );
          initializeWebSocket();
          const socket = getWebSocket();
          return socket?.send(
            JSON.stringify({
              event: "delete_fingerprint",
              payload: { matricNo: response.data.matricNo, courseCode },
            })
          );
        }
        console.log(
          "Student has been disenrolled for this course",
          response.data
        );
        setSuccessMessage(response.data.message);
        formik.resetForm();
        closeModal();
        dispatch(AddEnrolledStudents(response.data.students));
        setIsDeleteStudentting(false);
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 7000);
        router.back();
      } catch (error) {
        console.error("Failed to disenrolled:", error);
        setErrorMessage("Failed to disenrolled. Try again!");
        setIsDeleteStudentting(false);
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 7000);
      }
    },
  });
  useEffect(() => {
    const socket = getWebSocket();

    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      if (feedback.event !== "delete_fingerprint_feedback") return;
      console.log("Delete Fingerprint feedback received:", feedback);
      setIsDeleteStudentting(false);

      if (feedback.payload.error) {
        setSuccessMessage("");
        setErrorMessage(feedback.payload.message);
      } else {
        formik.resetForm();
        setSuccessMessage(feedback.payload.message);
        closeModal();
        dispatch(AddEnrolledStudents(feedback.payload.students));
        router.back();
      }
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 7000);
    };

    socket?.addEventListener("message", handleAttendanceFeedback);

    return () => {
      socket?.removeEventListener("message", handleAttendanceFeedback);
    };
  }, []);

  useEffect(() => {
    const socket = getWebSocket();

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
        field below.
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
          placeholder=""
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
