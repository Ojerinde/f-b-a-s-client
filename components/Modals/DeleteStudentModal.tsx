import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import HttpRequest from "@/store/services/HttpRequest";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { AddEnrolledStudents } from "@/store/studentss/StudentsSlice";
import { getWebSocket } from "@/app/dashboard/websocket";
import { emitToastMessage } from "@/utils/toastFunc";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

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
  const { lecturerDeviceLocation } = useAppSelector((state) => state.devices);

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
        if (!lecturerDeviceLocation) {
          emitToastMessage(
            "Device location not found. Please go to the settings page to set up the location of the device to communicate with.",
            "error"
          );
          return;
        }
        setIsDeleteStudentting(true);
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
          const socket = getWebSocket();
          return socket?.send(
            JSON.stringify({
              event: "delete_fingerprint",
              payload: {
                students: [response.data.matricNo],
                courseCode,
                email: GetItemFromLocalStorage("user").email,
                deviceLocation: lecturerDeviceLocation,
              },
            })
          );
        }

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
      setIsDeleteStudentting(false);

      if (feedback.payload.error) {
        setSuccessMessage("");
        setErrorMessage(feedback.payload.message);
        emitToastMessage(feedback.payload.message, "error");
      } else {
        formik.resetForm();
        setSuccessMessage(feedback.payload.message);
        emitToastMessage(feedback.payload.message, "success");
        closeModal();

        dispatch(AddEnrolledStudents(feedback.payload.students));
        router.push("/dashboard/my_courses/");
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
      emitToastMessage(feedback.payload.message, "success");
    };

    socket?.addEventListener("message", handleAttendanceRecorded);

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
