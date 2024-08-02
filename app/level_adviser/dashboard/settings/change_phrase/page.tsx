"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import HttpRequest from "@/store/services/HttpRequest";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import Button from "@/components/UI/Button/Button";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import InputField from "@/components/UI/Input/Input";
import { emitToastMessage } from "@/utils/toastFunc";


const ChangePhrasePage = () => {
  const [showPhrase, setShowPhrase] = useState<boolean>(false);
  const la = GetItemFromLocalStorage("user");

  // Yup schema configurations
  const validationSchema = Yup.object().shape({
    phrase: Yup.string().required("Phrase is required"),
  });
  // Formik validation configurations
  const formik = useFormik({
    initialValues: {
      phrase: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    async onSubmit(values, actions) {
      const { phrase } = values;
      try {
        const response = await HttpRequest.patch(
          "/auth/level_adviser/updatePhrase",
          {
            email: la?.email,
            phrase,
          }
        );
        formik.setValues({
          ...formik.values,
          phrase: response?.data.data.la.clearPhrase,
        });
        emitToastMessage("Clear-phrase changed successfully", 'success')

        formik.resetForm();
      } catch (error: any) {
        emitToastMessage(error?.response.data.message, 'error')

      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const updatePhraseVisibility = () => {
    setShowPhrase((prev) => !prev);
  };

  useEffect(() => {
    const fetchClearPhrase = async () => {
      try {
        const response = await HttpRequest.get(
          `/auth/level_adviser/getPhrase/${la?.email}`
        );
        const { clearPhrase } = response.data.data;

        formik.setValues({
          ...formik.values,
          phrase: clearPhrase,
        });
      } catch (error: any) {
        emitToastMessage(error?.response.data.message, 'error')
      }
    };

    fetchClearPhrase();
  }, [la?.email]);

  return (
    <div className="settings_password">
      <h2 className="courses-header settings_form">Change Phrase</h2>
      <form onSubmit={formik.handleSubmit} className="settings_form">
        <InputField
          id={`phrase`}
          label="Phrase"
          type={showPhrase ? "text" : "password"}
          name={`phrase`}
          value={formik.values.phrase}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.errors.phrase && formik.touched.phrase}
          inputErrorMessage={formik.errors.phrase}
          showPassword={showPhrase}
          passwordIcon={true}
          updatePasswordVisibility={updatePhraseVisibility}
        />

        <section>
          <Button id="btn__submit" type="submit" disabled={!formik.isValid}>
            {formik.isSubmitting ? <LoadingSpinner color="white" /> : "Submit"}
          </Button>
        </section>
      </form>
    </div>
  );
};
export default ChangePhrasePage;
