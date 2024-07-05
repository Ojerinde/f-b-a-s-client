"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";
import { MdPersonPin } from "react-icons/md";
import { LuView } from "react-icons/lu";
import Pagination from "@/components/UI/Pagination/Pagination";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";

interface EnrolledStudentsProps {
  params: any;
}

const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({ params }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { enrolledStudents, isFetchingEnrolledStudents } = useAppSelector(
    (state) => state.students
  );

  const [start, setStart] = useState(0);

  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const matricNoHandler = (matricNo: string) => {
    const modifiedMatricNo = matricNo.replace("/", "_");
    return modifiedMatricNo;
  };
  /// Pagination logic
  const studentsPerPage = 7;
  const end = start + studentsPerPage;

  const handlePageChange = (page: number) => {
    const newStart = (page - 1) * studentsPerPage;
    setStart(newStart);
  };

  return (
    <div className="enrollmentPage">
      <h2 className="enrollmentPage-title">
        Enrolled Students for {modifiedCourseCode}
      </h2>
      {!isFetchingEnrolledStudents && enrolledStudents.length === 0 && (
        <div className="courses-nocourse">
          <RiCreativeCommonsZeroFill />
          <p>No student has been enrolled for this course yet.</p>
          <button className="coursePage-button" onClick={() => router.back()}>
            Go back
          </button>
        </div>
      )}
      {isFetchingEnrolledStudents && (
        <LoadingSpinner color="blue" height="big" />
      )}
      {!isFetchingEnrolledStudents && enrolledStudents.length > 0 && (
        <ul className="enrollmentPage-list">
          {enrolledStudents.slice(start, end).map((student: any) => (
            <li
              key={student._id}
              onClick={() =>
                router.push(`${pathname}/${matricNoHandler(student.matricNo)}`)
              }
            >
              <div className="enrollmentPage-left">
                <MdPersonPin />
                <div>
                  <h3>{student.name}</h3>
                  <h4> {student.matricNo}</h4>
                </div>
              </div>

              <Link href={`${pathname}/${matricNoHandler(student.matricNo)}`}>
                <LuView className="enrollmentPage-right" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {enrolledStudents.length > 0 && (
        <Pagination
          length={enrolledStudents.length}
          itemsPerPage={studentsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EnrolledStudents;
