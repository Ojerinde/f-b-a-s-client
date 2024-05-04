"use client";
import React, { useEffect } from "react";
import { FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { IoIosRemoveCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import HttpRequest from "@/store/services/HttpRequest";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { AddAllCourses } from "@/store/courses/CoursesSlice";
import Navigation from "@/components/Navigation/Navigation";
import InformationInput from "@/components/UI/Input/InformationInput";
import Button from "@/components/UI/Button/Button";

interface Course {
  courseCode: string;
  courseName: string;
}

interface FormValuesType {
  name: string;
  email: string;
  courses: Course[];
}

const UpdateLecturerInformation: React.FC = () => {
  const router = useRouter();
  const loggedInLecturer = GetItemFromLocalStorage("user");
  const dispatch = useAppDispatch();

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: loggedInLecturer?.name,
      email: loggedInLecturer?.email,
      courses: [{ courseCode: "", courseName: "" }],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      courses: Yup.array().of(
        Yup.object().shape({
          courseCode: Yup.string()
            .required("Course Code is required")
            .matches(
              /^[A-Z]{3} \d{3}$/,
              "Course must be in the format 'XXX 000'"
            ),
          courseName: Yup.string().required("Course Name is required"),
        })
      ),
    }),

    onSubmit: async (values, actions) => {
      try {
        await HttpRequest.post(`/lecturers`, values);

        // Reset form after successful submission
        actions.resetForm();

        router.push("/dashboard/my_courses");
      } catch (error) {
        console.error("Error creating lecturer:", error);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const handleAddCourse = () => {
    formik.setValues({
      ...formik.values,
      courses: [...formik.values.courses, { courseCode: "", courseName: "" }],
    });
  };

  const removeCourse = (index: number) => {
    if (
      !confirm(
        "Are you sure you want to remove this course? This will delete the course related data "
      )
    )
      return;
    const updatedCourses = [...formik.values.courses];
    updatedCourses.splice(index, 1);
    formik.setValues({
      ...formik.values,
      courses: updatedCourses,
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await HttpRequest.get(
          `/courses/${loggedInLecturer.email}`
        );
        dispatch(AddAllCourses(response.data.courses));
        // Remove _id
        const modifiedCourses = response.data.courses.map((course: Course) => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
        }));
        formik.setValues({
          name: loggedInLecturer?.name,
          email: loggedInLecturer?.email,
          courses: [...modifiedCourses, { courseCode: "", courseName: "" }],
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="update">
      <Navigation />
      <div className="update-container">
        <div className="update-container__left">
          <h2>Welcome!</h2>
          <h3>{loggedInLecturer?.name.split(" ")[0]}</h3>
          <p>One more step to go.</p>
        </div>
        <div className="update-container__right">
          <Link href="/dashboard" className="continue">
            Continue To Dashboard
          </Link>
          <h2>Update your information.</h2>
          <form onSubmit={formik.handleSubmit}>
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

            <div>
              <h3 className="update-container__label">Courses:</h3>
              {formik.values.courses.map((course: Course, index: number) => (
                <div className="update-container__courses" key={index}>
                  <div className="left">
                    <InformationInput
                      id={`courseCode${index}`}
                      label="Course Code"
                      type="text"
                      name={`courses[${index}].courseCode`}
                      value={formik.values.courses[index].courseCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseCode &&
                        formik.touched.courses?.[index]?.courseCode
                      }
                      inputErrorMessage={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseCode
                      }
                    />
                  </div>
                  <div className="right">
                    <InformationInput
                      id={`courseName${index}`}
                      label="Course Name"
                      type="text"
                      name={`courses[${index}].courseName`}
                      value={formik.values.courses[index].courseName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseName &&
                        formik.touched.courses?.[index]?.courseName
                      }
                      inputErrorMessage={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseName
                      }
                    />
                  </div>
                  <IoIosRemoveCircle
                    className="icon"
                    onClick={() => removeCourse(index)}
                  />
                </div>
              ))}
              <button
                className="update-container__button"
                type="button"
                onClick={handleAddCourse}
              >
                Add Another Course
              </button>
            </div>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateLecturerInformation;
