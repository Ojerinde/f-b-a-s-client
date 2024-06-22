"use client";
import InformationInput from "@/components/UI/Input/InformationInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { GrUpdate } from "react-icons/gr";
import { SiNintendoswitch } from "react-icons/si";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

interface FormValuesType {
  title: string;
  name: string;
  email: string;
  level: string;
}
const LAProfile = () => {
  const router = useRouter();
  const la = GetItemFromLocalStorage("user");

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: la?.name || "",
      email: la?.email || "",
      title: la?.title || "",
      level: la?.level || "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      level: Yup.string().required("Level is required"),
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
    }),

    onSubmit: async (values, actions) => {},
  });

  return (
    <section className="laProfile">
      <h2 className="courses-header">Profile</h2>
      <aside className="laProfile-profile">
        <div className="laProfile-profile__left">
          <div>
            <InformationInput
              id="title"
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputErrorMessage={formik.errors.title}
              placeholder={formik.values.title}
              readOnly
            />
            <InformationInput
              id="name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputErrorMessage={formik.errors.name}
              placeholder={formik.values.name}
              readOnly
            />

            <InformationInput
              id="email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputErrorMessage={formik.errors.email}
              placeholder={formik.values.email}
              readOnly
            />
            <InformationInput
              id="level"
              type="text"
              name="level"
              value={formik.values.level}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputErrorMessage={formik.errors.level}
              placeholder={formik.values.level}
              readOnly
            />
          </div>
        </div>
        <div className="laProfile-profile__right">
          <div
            className="laProfile-profile__item"
            onClick={() =>
              router.push("/level_adviser/dashboard/settings/change_password")
            }
          >
            <SiNintendoswitch />
            <p>Change Password</p>
          </div>
          <div
            className="laProfile-profile__item"
            onClick={() =>
              router.push("/level_adviser/dashboard/settings/change_phrase")
            }
          >
            <GrUpdate />
            <p>Update Fingerprint Clear Phrase</p>
          </div>
        </div>
      </aside>
    </section>
  );
};
export default LAProfile;
