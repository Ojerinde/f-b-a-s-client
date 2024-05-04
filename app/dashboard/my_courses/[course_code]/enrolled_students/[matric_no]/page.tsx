"use client";

import AllCoursesModal from "@/components/Modals/AllCoursesModal";
import AttendancePerformanceModal from "@/components/Modals/AttendancePerformance";
import DeleteStudentModal from "@/components/Modals/DeleteStudentModal";
import OverallProgressModal from "@/components/Modals/OverallProgress";
import OverlayModal from "@/components/Modals/OverlayModal";
import StudentDetailsOverlay from "@/components/Modals/StudentDetailsOverlay";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { useAppSelector } from "@/hooks/reduxHook";
import { useEffect, useState } from "react";
import { FaChartPie } from "react-icons/fa";
import { GrOverview, GrView } from "react-icons/gr";

interface StudentDetailsProps {
  params: { matric_no: string; course_code: string };
}
const StudentDetails: React.FC<StudentDetailsProps> = ({ params }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isFetchingStudentOtherDetails, setIsFetchingStudentOtherDetails] =
    useState<boolean>(false);
  const [viewCoursesModalOpen, setViewCoursesModalOpen] =
    useState<boolean>(false);
  const [viewAttendanceModalOpen, setViewAttendanceModalOpen] =
    useState<boolean>(false);
  const [viewOverallModalOpen, setViewOverallModalOpen] =
    useState<boolean>(false);

  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const matricNo = params.matric_no.replace("_", "/");
  const { enrolledStudents } = useAppSelector((state) => state.students);
  const student = enrolledStudents.find((stu) => stu.matricNo === matricNo);

  useEffect(() => {
    // Fetch other details about the students here
    const fetchStudentOtherDetails = () => {
      try {
        setIsFetchingStudentOtherDetails(true);
      } catch (error) {
        setIsFetchingStudentOtherDetails(false);
      } finally {
        setIsFetchingStudentOtherDetails(false);
      }
    };
    fetchStudentOtherDetails();
  }, []);

  return (
    <aside className="studentPage">
      <h2 className="enrollmentPage-title">Student Details</h2>
      <div className="studentPage-details">
        <h3>
          Name: <span>{student?.name}</span>
        </h3>
        <p>
          Matric No:<span>{student?.matricNo}</span>
        </p>
      </div>
      {isFetchingStudentOtherDetails ? (
        <LoadingSpinner height="big" color="blue" />
      ) : (
        <>
          <div className="studentPage-box">
            <div
              className="studentPage-box__item"
              onClick={() => setViewCoursesModalOpen(true)}
            >
              <GrView />
              <p>View Student Courses</p>
            </div>
            <div
              className="studentPage-box__item"
              onClick={() => setViewAttendanceModalOpen(true)}
            >
              <GrOverview />
              <p>Check Student Attendance Performance for Each Course</p>
            </div>
            <div
              className="studentPage-box__item"
              onClick={() => setViewOverallModalOpen(true)}
            >
              <FaChartPie />
              <p>See Overall Attendance Progress</p>
            </div>
          </div>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="coursePage-button"
          >
            Disenroll Student
          </button>
        </>
      )}

      {/* Reset Modal */}
      {deleteModalOpen && (
        <OverlayModal onClose={() => setDeleteModalOpen(false)}>
          <DeleteStudentModal
            courseCode={modifiedCourseCode!}
            studentMatricNo={matricNo}
            closeModal={() => setDeleteModalOpen(false)}
          />
        </OverlayModal>
      )}

      {/* View All Courses Modal */}
      {viewCoursesModalOpen && (
        <StudentDetailsOverlay onClose={() => setViewCoursesModalOpen(false)}>
          <AllCoursesModal
            courses={[]}
            onClose={() => setViewCoursesModalOpen(false)}
          />
        </StudentDetailsOverlay>
      )}

      {/* View Attendance performance Modal */}
      {viewAttendanceModalOpen && (
        <StudentDetailsOverlay
          onClose={() => setViewAttendanceModalOpen(false)}
        >
          <AttendancePerformanceModal
            courses={[]}
            onClose={() => setViewAttendanceModalOpen(false)}
          />
        </StudentDetailsOverlay>
      )}

      {/* View Overall performance Modal */}
      {viewOverallModalOpen && (
        <StudentDetailsOverlay onClose={() => setViewOverallModalOpen(false)}>
          <OverallProgressModal
            courses={[]}
            onClose={() => setViewOverallModalOpen(false)}
          />
        </StudentDetailsOverlay>
      )}
    </aside>
  );
};
export default StudentDetails;
