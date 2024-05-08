import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import HttpRequest from "@/store/services/HttpRequest";
import { useRouter } from "next/navigation";

interface DeactivateUserModalProps {
  email: string;
  closeModal: () => void;
}

interface FormValuesType {
  email: string;
}

const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  email,
  closeModal,
}) => {
  const [isDeactivatingUser, setIsDeactivateUserting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const formik = useFormik<FormValuesType>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .matches(
          new RegExp(email),
          "Email must matched that of the intended lecturer own"
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      if (values.email !== email) {
        setErrorMessage("Email must matched that of the intended lecturer own");
        return;
      }
      try {
        setIsDeactivateUserting(true);
        const response = await HttpRequest.patch(`/auth/deactivateAccount`, {
          email,
        });
        setSuccessMessage(response.data.message);
        formik.resetForm();
        closeModal();
        router.push("/");
      } catch (error) {
        setErrorMessage("Failed to deactivate. Try again!");
      } finally {
        setIsDeactivateUserting(false);
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
        This action will deactivate your account.
      </h2>
      <h3 className="resetOverlay-text_2">
        If you wish to continue, enter <span>{email}</span> in the field below.
      </h3>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="email"
          type="text"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.email}
          placeholder=""
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <button
          className="resetOverlay-button"
          type="submit"
          disabled={isDeactivatingUser || !formik.isValid}
        >
          {isDeactivatingUser ? "Deactivating..." : "Deactivate"}
        </button>
      </form>
    </div>
  );
};
export default DeactivateUserModal;
