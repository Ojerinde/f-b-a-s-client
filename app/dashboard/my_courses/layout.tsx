"use client";

import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { AddAllCourses } from "@/store/courses/CoursesSlice";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(false);

  const loggedInLecturer = GetItemFromLocalStorage("user");
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { courses } = useAppSelector((state) => state.courses);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await HttpRequest.get(
          `/courses/${loggedInLecturer?.email}`
        );
        dispatch(AddAllCourses(response.data.courses));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    if (courses.length === 0) {
      setLoading(true);
      fetchCourses();
      setLoading(false);
    }
  }, []);
  const handleBackRouting = () => {
    router.back();
  };
  return (
    <div>
      <button
        className="coursePage-back"
        type="button"
        onClick={handleBackRouting}
      >
        <IoArrowBack />
        <span>Back</span>
      </button>
      {loading && <LoadingSpinner color="blue" height="big" />}
      {!loading && children}
    </div>
  );
}
