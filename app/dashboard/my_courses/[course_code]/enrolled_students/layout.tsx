"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import {
  AddEnrolledStudents,
  updateIsFetchingEnrolledStudentsState,
} from "@/store/studentss/StudentsSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params: { course_code: string } = useParams();
  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        dispatch(updateIsFetchingEnrolledStudentsState(true));
        const response = await HttpRequest.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${modifiedCourseCode}/enroll`
        );

        dispatch(AddEnrolledStudents(response.data.students));
      } catch (error) {
        toast("Error fetching enrolled Students", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "black",
          style: {
            background: "orangered",
            color: "white",
            fontSize: "1.7rem",
            fontFamily: "Poetsen One",
            letterSpacing: "0.15rem",
            lineHeight: "1.7",
            padding: "1rem",
          },
        });
      } finally {
        dispatch(updateIsFetchingEnrolledStudentsState(false));
      }
    };
    fetchEnrolledStudents();
  }, [params?.course_code]);

  return <div>{children}</div>;
}
