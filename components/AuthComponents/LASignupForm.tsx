import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import InputField from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import HttpRequest from "@/store/services/HttpRequest";
import Link from "next/link";
import PasswordModal from "../Modals/PasswordModal";

export interface UserData {
  fullname: string;
  title: string;
  level: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const LASignUpForm = () => {
  const router = useRouter();

  // State managements
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showError, setShowError] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });

  // Password Modal requirements
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [requirements, setRequirements] = useState([
    { text: "At least 8 characters", isValid: false },
    { text: "At least one uppercase letter", isValid: false },
    { text: "At least one lowercase letter", isValid: false },
    { text: "At least one number", isValid: false },
    { text: "At least one special character", isValid: false },
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    formik.handleChange(e);

    const newRequirements = requirements.map((req) => {
      switch (req.text) {
        case "At least 8 characters":
          return { ...req, isValid: value.length >= 8 };
        case "At least one uppercase letter":
          return { ...req, isValid: /[A-Z]/.test(value) };
        case "At least one lowercase letter":
          return { ...req, isValid: /[a-z]/.test(value) };
        case "At least one number":
          return { ...req, isValid: /[0-9]/.test(value) };
        case "At least one special character":
          return { ...req, isValid: /[!@#$%^&*]/.test(value) };
        default:
          return req;
      }
    });

    setRequirements(newRequirements);
  };

  // Yup schema configurations
  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .required("Fullname is required")
      .test(
        "full-name",
        "Name must include both first name and last name",
        (value) => {
          if (!value) {
            return false;
          }
          return value.trim().split(" ").length === 2;
        }
      ),
    title: Yup.string().required("Title is required"),
    level: Yup.string()
      .required("Level is required")
      .oneOf(
        ["100", "200", "300", "400", "500", "600", "700"],
        "Level must be one of 100, 200, 300, 400, 500, 600, 700"
      ),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), ""], "Confirm Password does not match"),
  });

  // Formik validation configurations
  const formik = useFormik({
    initialValues: {
      fullname: "",
      title: "",
      level: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    async onSubmit(values, actions) {
      const { confirmPassword, password, email, fullname, title, level } =
        values;
      try {
        const response = await HttpRequest.post("/auth/level_adviser/signup", {
          fullname,
          title,
          level,
          email,
          confirmPassword,
          password,
        });
        setSuccessMessage(
          "You have signed up successfully, kindly check your mail for the verification link"
        );
      } catch (error: any) {
        setShowError(() => ({
          hasError: true,
          message: `${error?.response?.data.message}.`,
        }));
      } finally {
        actions.setSubmitting(false);
        setTimeout(() => {
          setShowError(() => ({ hasError: false, message: "" }));
          setSuccessMessage("");
          router.push("/level_adviser/login");
        }, 7000);
      }
    },
  });

  const updatePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <InputField
          id="fullname"
          label="Fullname"
          type="text"
          name="fullname"
          invalid={formik.errors.fullname && formik.touched.fullname}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fullname}
          inputErrorMessage={formik.errors.fullname}
        />
        <InputField
          id="title"
          label="Title"
          type="text"
          name="title"
          invalid={formik.errors.title && formik.touched.title}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          inputErrorMessage={formik.errors.title}
        />
        <InputField
          id="level"
          label="Level"
          type="text"
          name="level"
          invalid={formik.errors.level && formik.touched.level}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.level}
          inputErrorMessage={formik.errors.level}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          name="email"
          invalid={formik.errors.email && formik.touched.email}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          inputErrorMessage={formik.errors.email}
        />
        <div className="password-modal__box">
          <InputField
            id="password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            invalid={formik.errors.password && formik.touched.password}
            inputErrorMessage={formik.errors.password}
            placeholder=""
            onChange={(e: any) => {
              formik.handleChange(e);
              handlePasswordChange(e);
            }}
            onBlur={(e: any) => {
              formik.handleBlur(e);
              setShowPasswordModal(false);
            }}
            value={formik.values.password}
            passwordIcon={true}
            showPassword={showPassword}
            updatePasswordVisibility={updatePasswordVisibility}
            onFocus={() => setShowPasswordModal(true)}
          />
          <PasswordModal requirements={requirements} show={showPasswordModal} />
        </div>

        <InputField
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          invalid={
            formik.errors.confirmPassword && formik.touched.confirmPassword
          }
          inputErrorMessage={formik.errors.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          placeholder=""
          passwordIcon={true}
          showPassword={showPassword}
          updatePasswordVisibility={updatePasswordVisibility}
        />
        <Link href="/" className="login-link">
          Lecturer? Signup here
        </Link>
        <div className="login-box">
          <Link href="/level_adviser/reactivate_account" className="login-link">
            Reactivate Account?
          </Link>
        </div>

        {showError.hasError && (
          <p className="signup-error">{showError.message}</p>
        )}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <section>
          <Button id="btn__submit" type="submit" disabled={!formik.isValid}>
            {formik.isSubmitting ? <LoadingSpinner color="white" /> : "Sign Up"}
          </Button>
        </section>
      </form>
    </>
  );
};

export default LASignUpForm;
