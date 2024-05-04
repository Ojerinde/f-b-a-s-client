"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import {
  AddEnrolledStudents,
  updateIsFetchingEnrolledStudentsState,
} from "@/store/studentss/StudentsSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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
        console.log("enrolled students", response.data.students);

        dispatch(AddEnrolledStudents(response.data.students));
      } catch (error) {
        console.error("Error fetching enrolled Students:", error);
      } finally {
        dispatch(updateIsFetchingEnrolledStudentsState(false));
      }
    };
    fetchEnrolledStudents();
  }, [params?.course_code]);

  return <div>{children}</div>;
}
