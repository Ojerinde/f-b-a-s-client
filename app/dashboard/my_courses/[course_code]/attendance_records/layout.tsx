"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import {
  AddAttendanceRecords,
  updateIsFetchingAttendanceRecordsState,
} from "@/store/studentss/StudentsSlice";
import { emitToastMessage } from "@/utils/toastFunc";
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
    const fetchAttendanceRecords = async () => {
      try {
        dispatch(updateIsFetchingAttendanceRecordsState(true));
        const response = await HttpRequest.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${modifiedCourseCode}/attendance`
        );

        dispatch(AddAttendanceRecords(response.data.attendanceRecords));
      } catch (error) {
        emitToastMessage("Error fetching enrolled Students", 'error')
       
      } finally {
        dispatch(updateIsFetchingAttendanceRecordsState(false));
      }
    };
    fetchAttendanceRecords();
  }, [params?.course_code]);

  return <div>{children}</div>;
}
