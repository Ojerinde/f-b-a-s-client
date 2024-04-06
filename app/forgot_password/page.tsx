"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import HttpRequest from "@/store/services/HttpRequest";
import LoadingSpinner from "../components/UI/LoadingSpinner/LoadingSpinner";
import InlineFeedback from "../components/UI/Input/InlineFeedback";
import Button from "../components/UI/Button/Button";
import bg from "@/public/images/f.jpeg";
import InformationInput from "../components/UI/Input/InformationInput";

const ForgotPassword = () => {
  const router = useRouter();

  const [showError, setShowError] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Yup schema configurations
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
  });

  // Formik validation configurations
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    // Form submission
    async onSubmit(values, actions) {
      const { email } = values;
      console.log(email);
      try {
        await HttpRequest.post("/auth/forgotPassword", {
          email,
        });
        setSuccessMessage(
          "A mail with reset link has been sent to your inbox!"
        );
      } catch (error: any) {
        setShowError(() => ({
          hasError: true,
          message: `${error?.response?.data.message} Try again.`,
        }));
      } finally {
        // Enabling the submitting of the form again
        actions.setSubmitting(false);
        setTimeout(() => {
          setShowError(() => ({ hasError: false, message: "" }));
          setSuccessMessage("");
        }, 7000);
      }
    },
  });

  return (
    <section
      className="forgot"
      style={{
        backgroundImage: `url(${bg.src})`,
      }}
    >
      <div className="forgot-card">
        <h3 className="forgot-card__heading">Forgot Password?</h3>
        <p className="forgot-card__para">
          No worries, we’ll send you reset instructions.
        </p>
        <form onSubmit={formik.handleSubmit} className="">
          <InformationInput
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
          {formik.isSubmitting && <LoadingSpinner />}
          {showError.hasError && (
            <p className="signup-error">{showError.message}</p>
          )}
          {successMessage && <p className="signup-success">{successMessage}</p>}

          <Button type="submit">
            {formik.isSubmitting ? <LoadingSpinner /> : "Click To Reset"}
          </Button>

          <button
            type="button"
            className="forgot-card__button update-container__button"
            onClick={() => {
              router.push("/");
            }}
          >
            Back to login
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;