"use client";

import AttendanceModal from "@/components/Modals/AttendanceModal";
import EnrollmentModal from "@/components/Modals/EnrollmentModal";
import OverlayModal from "@/components/Modals/OverlayModal";
import ResetModal from "@/components/Modals/ResetModal";
import { useAppSelector } from "@/hooks/reduxHook";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { BsRecordCircleFill } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiBook2Fill } from "react-icons/ri";

interface CourseDetailsPageprops {
  params: any;
}

const CourseDetailsPage: React.FC<CourseDetailsPageprops> = ({ params }) => {
  const [enrollModalOpen, setEnrollModalOpen] = useState<boolean>(false);
  const [attendanceModalOpen, setAttendanceModalOpen] =
    useState<boolean>(false);
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const { course_code } = params;
  const { courses } = useAppSelector((state) => state.courses);
  const loggedInLecturer = GetItemFromLocalStorage("user");

  const course = courses.find(
    (cou) => cou.courseCode.replace(" ", "_").toLowerCase() === course_code
  );

  return (
    <div className="coursePage">
      <div className="coursePage-details">
        <RiBook2Fill />
        <div>
          <h2>{course?.courseName}</h2>
          <h3>{course?.courseCode}</h3>
        </div>
      </div>
      <div className="coursePage-actions">
        <button onClick={() => setEnrollModalOpen(true)}>
          <IoPersonAddSharp />
          <span>Enroll Student</span>
        </button>
        <button onClick={() => setAttendanceModalOpen(true)}>
          <BsRecordCircleFill />
          <span>Take Attendance</span>
        </button>
      </div>
      <div className="coursePage-link">
        <Link href={`${pathname}/enrolled_students`}>
          View all enrolled students
        </Link>
        <Link href={`${pathname}/attendance_records`}>
          View all attendance records
        </Link>
      </div>

      <button
        className="coursePage-button"
        onClick={() => setResetModalOpen(true)}
      >
        Reset Course
      </button>

      {/* Enroll Modal */}
      {enrollModalOpen && (
        <OverlayModal onClose={() => setEnrollModalOpen(false)}>
          <EnrollmentModal
            course={course!}
            lecturerEmail={loggedInLecturer?.email}
            closeModal={() => setEnrollModalOpen(false)}
          />
        </OverlayModal>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <OverlayModal onClose={() => setAttendanceModalOpen(false)}>
          <AttendanceModal
            course={course!}
            closeModal={() => setAttendanceModalOpen(false)}
          />
        </OverlayModal>
      )}
      {/* Reset Modal */}
      {resetModalOpen && (
        <OverlayModal onClose={() => setResetModalOpen(false)}>
          <ResetModal
            course={course!}
            closeModal={() => setResetModalOpen(false)}
          />
        </OverlayModal>
      )}
    </div>
  );
};

export default CourseDetailsPage;
