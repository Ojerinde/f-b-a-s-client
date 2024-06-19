"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { fetchArchivedLecturers } from "@/store/archived/ArchivedSlice";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchArchivedLecturers());
  }, [dispatch]);

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
      {children}
    </div>
  );
}
