"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const page = () => {
  const pathname = usePathname();

  return (
    <div>
      <button type="button">TODO: Back button</button>
      <div>TODO: Details about course</div>
      <div>TODO: Atttendance and Enrollment button </div>
      <Link href={`${pathname}/enrolled_students`}>
        View all enrolled students
      </Link>
      <Link href={`${pathname}/attendance_records`}>
        View all attendance records
      </Link>
    </div>
  );
};

export default page;
