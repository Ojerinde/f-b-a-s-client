import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { getWebSocket, initializeWebSocket } from "@/app/dashboard/websocket";
import { toast } from "react-toastify";

interface ClearFingerprintOnSensorProps {
  closeModal: () => void;
}

interface FormValuesType {
  clearPhrase: string;
}

const ClearFingerprintOnSensor: React.FC<ClearFingerprintOnSensorProps> = ({
  closeModal,
}) => {
  const [isClearingFingerprints, setIsClearingFingerprints] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    initializeWebSocket();
  }, []);

  const formik = useFormik<FormValuesType>({
    initialValues: {
      clearPhrase: "",
    },
    validationSchema: Yup.object().shape({
      clearPhrase: Yup.string().required("Clear Phrase is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      try {
        initializeWebSocket();
        const socket = getWebSocket();

        setIsClearingFingerprints(true);
        socket?.send(
          JSON.stringify({
            event: "clear_fingerprints",
            payload: { clearPhrase: values.clearPhrase, level: "500" },
          })
        );
      } catch (error) {
        setErrorMessage("Failed to mark clear_fingerprints. Try again!");
      } finally {
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 10000);
      }
    },
  });

  useEffect(() => {
    const socket = getWebSocket();

    const handleAttendanceFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      if (feedback.event !== "clear_fingerprints_feedback") return;
      setIsClearingFingerprints(false);
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

    // Add event listener for attendance feedback
    socket?.addEventListener("message", handleAttendanceFeedback);

    // Clean up event listener when component unmounts
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
        This action will clear all the fingerprints on the sensor
      </h2>
      <h3 className="resetOverlay-text_2">
        If you wish to continue, enter the "Clear-Phrase" known by the Level
        adviser (LA) alone in the field below.
      </h3>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="clearPhrase"
          type="text"
          name="clearPhrase"
          value={formik.values.clearPhrase}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.clearPhrase}
          placeholder=""
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <button
          className="resetOverlay-button"
          type="submit"
          disabled={isClearingFingerprints || !formik.isValid}
        >
          {isClearingFingerprints ? "Clearing..." : "Clear"}
        </button>
      </form>
    </div>
  );
};
export default ClearFingerprintOnSensor;
