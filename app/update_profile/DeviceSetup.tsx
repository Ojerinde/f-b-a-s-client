"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import HttpRequest from "@/store/services/HttpRequest";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import Button from "@/components/UI/Button/Button";
import {
  GetItemFromLocalStorage,
  SetItemToLocalStorage,
} from "@/utils/localStorageFunc";
import SelectField from "@/components/UI/SelectField/SelectField";
import { emitToastMessage } from "@/utils/toastFunc";

// Define Option type for SelectField
interface Option {
  value: string;
  label: string;
}

const DeviceSetup = () => {
  // State management
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showError, setShowError] = useState<{
    hasError: boolean;
    message: string;
  }>({ hasError: false, message: "" });
  const [deviceOptions, setDeviceOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await HttpRequest.get("/devices");
        const devices = response?.data?.devicesConnected;
        if (devices.length === 0) {
          emitToastMessage(
            "None of the device is connected, Ensure the devices are switched on",
            "error"
          );
        }

        const options = devices?.map((device: any) => ({
          value: device,
          label: device.toUpperCase(),
        }));

        setDeviceOptions(options);
      } catch (error: any) {
        setShowError(() => ({
          hasError: true,
          message: "Failed to fetch devices. Please try again later.",
        }));
      }
    };

    fetchDevices();
  }, []);

  // Yup schema configurations
  const validationSchema = Yup.object().shape({
    deviceLocation: Yup.string().required("Device Location is required"),
  });

  // Formik validation configurations
  const formik = useFormik({
    initialValues: {
      deviceLocation: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    async onSubmit(values, actions) {
      const { deviceLocation } = values;
      SetItemToLocalStorage("deviceData", {
        email: GetItemFromLocalStorage("user").email,
        deviceLocation,
      });
      emitToastMessage("Device location updated successfully", "success");
      //   try {
      //     const response = await HttpRequest.post("/devices", {
      //       email: GetItemFromLocalStorage("user").email,
      //       deviceLocation,
      //     });

      //     formik.resetForm();
      //     setSuccessMessage("Device location updated successfully");
      //     emitToastMessage("Device location updated successfully", "success");
      //   } catch (error: any) {
      //     console.log("Updating eroor", error);
      //     emitToastMessage(
      //       "Error updating device location. Please try again later.",
      //       "error"
      //     );

      //     setShowError(() => ({
      //       hasError: true,
      //       message: `${
      //         error?.response?.data?.message ||
      //         "Error updating device location. Please try again later."
      //       }`,
      //     }));
      //   } finally {
      //     actions.setSubmitting(false);
      //     setTimeout(() => {
      //       setShowError(() => ({ hasError: false, message: "" }));
      //       setSuccessMessage("");
      //     }, 7000);
      //   }
    },
  });

  return (
    <div className="update-container__location">
      <h2 className="courses-header update-container__location--header">
        Setup Device Location
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <SelectField
          options={deviceOptions}
          value={deviceOptions.find(
            (option) => option.value === formik.values.deviceLocation
          )}
          onChange={(option) =>
            formik.setFieldValue("deviceLocation", option?.value || "")
          }
          placeholder="Select Device Location"
        />

        <section>
          <Button id="btn__submit" type="submit" disabled={!formik.isValid}>
            {formik.isSubmitting ? <LoadingSpinner color="white" /> : "Save"}
          </Button>
        </section>
      </form>
    </div>
  );
};

export default DeviceSetup;
