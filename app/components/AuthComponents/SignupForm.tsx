import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import InputField from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import HttpRequest from "@/store/services/HttpRequest";
import InlineFeedback from "../UI/Input/InlineFeedback";

export interface UserData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const router = useRouter();

  // State managements
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showError, setShowError] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });

  // Yup schema configurations
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), ""], "Confirm Password does not match"),
  });

  // Formik validation configurations
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    async onSubmit(values, actions) {
      const { confirmPassword, password, email, name } = values;
      try {
        // Seding a request to my backend
        await HttpRequest.post("/auth/signup", {
          name,
          email,
          confirmPassword,
          password,
        });
        setSuccessMessage("Check your inbox for verification link");
      } catch (error: any) {
        setShowError(() => ({
          hasError: true,
          message: `${error?.response?.data.message} Try logging in.`,
        }));
      } finally {
        actions.setSubmitting(false);
        setTimeout(() => {
          setShowError(() => ({ hasError: false, message: "" }));
          setSuccessMessage("");
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
          id="name"
          label="Name"
          type="name"
          name="name"
          invalid={formik.errors.name && formik.touched.name}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          inputErrorMessage={formik.errors.name}
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

        <InputField
          id="password"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          invalid={formik.errors.password && formik.touched.password}
          inputErrorMessage={formik.errors.password}
          placeholder=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          passwordIcon={true}
          showPassword={showPassword}
          updatePasswordVisibility={updatePasswordVisibility}
        />

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
export default SignUpForm;
