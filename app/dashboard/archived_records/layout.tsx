"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { fetchArchivedLecturers } from "@/store/archived/ArchivedSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArchivedLecturers());
  }, [dispatch]);

  return <div>{children}</div>;
}
