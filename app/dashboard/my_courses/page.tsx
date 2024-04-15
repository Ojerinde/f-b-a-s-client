"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/reduxHook";
import { FaBook } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { BsRecordCircleFill } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import EnrollmentModal from "@/components/Modals/EnrollmentModal";
import AttendanceModal from "@/components/Modals/AttendanceModal";
import OverlayModal from "@/components/Modals/OverlayModal";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
}

const Dashboard: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const loggedInLecturer = GetItemFromLocalStorage("user");

  const { courses } = useAppSelector((state) => state.courses);

  const [enrollModalOpen, setEnrollModalOpen] = useState<boolean>(false);
  const [attendanceModalOpen, setAttendanceModalOpen] =
    useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleAttendanceClick = (course: Course) => {
    setSelectedCourse(course);
    setAttendanceModalOpen(true);
  };

  const handleRedirectionToCoursePage = (courseCode: string) => {
    const modifiedCourseCode = courseCode.split(" ").join("_").toLowerCase();
    router.push(`${pathname}/${modifiedCourseCode}`);
  };

  return (
    <div className="courses">
      <h2 className="courses-header">My Courses</h2>

      <ul className="courses-list">
        {courses.map((course, index) => (
          <li key={index} className="courses-item">
            <FaBook className="courses-item__icon" />
            <div className="courses-item__details">
              <h3
                onClick={() => handleRedirectionToCoursePage(course.courseCode)}
              >
                {course.courseName}
              </h3>
              <p>{course.courseCode}</p>
            </div>
            <div className="courses-item__actions">
              <button onClick={() => handleEnrollClick(course)}>
                <IoPersonAddSharp />
                <span>Enroll Student</span>
              </button>
              <button onClick={() => handleAttendanceClick(course)}>
                <BsRecordCircleFill />
                <span>Take Attendance</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Enroll Modal */}
      {enrollModalOpen && (
        <OverlayModal onClose={() => setEnrollModalOpen(false)}>
          <EnrollmentModal
            course={selectedCourse}
            lecturerEmail={loggedInLecturer?.email}
            closeModal={() => setEnrollModalOpen(false)}
          />
        </OverlayModal>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <OverlayModal onClose={() => setAttendanceModalOpen(false)}>
          <AttendanceModal
            course={selectedCourse}
            closeModal={() => setAttendanceModalOpen(false)}
          />
        </OverlayModal>
      )}
    </div>
  );
};

export default Dashboard;
