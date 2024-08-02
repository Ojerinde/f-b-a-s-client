"use client";

import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { useAppDispatch } from "@/hooks/reduxHook";
import { AddAllCourses } from "@/store/courses/CoursesSlice";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await HttpRequest.get(
          `/courses/${loggedInLecturer?.email}`
        );
        if (response.data.courses.length === 0) {
          emitToastMessage("You have not register any course yet", 'success')

          setLoading(false);
          return;
        }
        dispatch(AddAllCourses(response.data.courses));
        setLoading(false);
      } catch (error) {
        emitToastMessage("Could not fetch your course(s)", 'error')
        setLoading(false);
      }
    };

    fetchCourses();
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
