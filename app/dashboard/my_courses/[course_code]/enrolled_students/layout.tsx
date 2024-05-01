"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import { AddEnrolledStudents } from "@/store/studentss/StudentsSlice";
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

  const { enrolledStudents } = useAppSelector((state) => state.students);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await HttpRequest.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/enroll/${modifiedCourseCode}`
        );

        dispatch(AddEnrolledStudents(response.data.students));
      } catch (error) {
        console.error("Error fetching enrolled Students:", error);
      }
    };
    if (enrolledStudents.length === 0) {
      fetchEnrolledStudents();
    }
  }, [params?.course_code]);

  return <div>{children}</div>;
}
