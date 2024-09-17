import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { getWebSocket } from "@/app/dashboard/websocket";
import { emitToastMessage } from "@/utils/toastFunc";
import { useAppSelector } from "@/hooks/reduxHook";
import SelectField from "../UI/SelectField/SelectField";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

interface ClearFingerprintOnSensorProps {
  closeModal: () => void;
}

interface FormValuesType {
  clearPhrase: string;
  level: string;
}
const levelOptions = [
  { value: "700", label: "700" },
  { value: "600", label: "600" },
  { value: "500", label: "500" },
  { value: "400", label: "400" },
  { value: "300", label: "300" },
  { value: "200", label: "200" },
  { value: "100", label: "100" },
];

const ClearFingerprintOnSensor: React.FC<ClearFingerprintOnSensorProps> = ({
  closeModal,
}) => {
  const [isClearingFingerprints, setIsClearingFingerprints] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { lecturerDeviceLocation } = useAppSelector((state) => state.devices);

  const formik = useFormik<FormValuesType>({
    initialValues: {
      clearPhrase: "",
      level: "500",
    },
    validationSchema: Yup.object().shape({
      clearPhrase: Yup.string().required("Clear Phrase is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      try {
        if (!lecturerDeviceLocation) {
          emitToastMessage(
            "Device location not found. Please go to the settings page to set up the location of the device to communicate with.",
            "error"
          );
          return;
        }
        const socket = getWebSocket();

        setIsClearingFingerprints(true);
        socket?.send(
          JSON.stringify({
            event: "clear_fingerprints",
            payload: {
              clearPhrase: values.clearPhrase,
              level: values.level,
              deviceLocation: lecturerDeviceLocation,
              email: GetItemFromLocalStorage("user").email,
            },
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
        emitToastMessage(feedback.payload.message, "error");
      } else {
        setSuccessMessage(feedback.payload.message);
        emitToastMessage(feedback.payload.message, "success");
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
      emitToastMessage(feedback.payload.message, "success");
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
        <SelectField
          options={levelOptions}
          value={levelOptions.find(
            (option) => option.value === formik.values.level
          )}
          onChange={(option) =>
            formik.setFieldValue("level", option?.value || "")
          }
          placeholder="Select Device Location"
        />
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
