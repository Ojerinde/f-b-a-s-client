"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";
import { MdPersonPin } from "react-icons/md";
import { LuView } from "react-icons/lu";
import Pagination from "@/components/UI/Pagination/Pagination";

interface Student {
  _id: string;
  name: string;
  matricNo: string;
}

interface EnrolledStudentsProps {
  params: any;
}

const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({ params }) => {
  const pathname = usePathname();
  const { enrolledStudents } = useAppSelector((state) => state.students);
  const [start, setStart] = useState(0);

  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const matricNoHandler = (matricNo: string) => {
    const modifiedMatricNo = matricNo.replace("/", "_");
    return modifiedMatricNo;
  };
  const studentsPerpage = 4;
  const end = start + studentsPerpage;
  const handlePageChange = (num: number) => {
    setStart(num - 1);
  };

  return (
    <div className="enrollmentPage">
      <h2 className="enrollmentPage-title">
        Enrolled Students for {modifiedCourseCode}
      </h2>
      <ul className="enrollmentPage-list">
        {enrolledStudents.slice(start, end).map((student: any) => (
          <li key={student._id}>
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
      <Pagination
        length={enrolledStudents.length}
        itemsPerPage={studentsPerpage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EnrolledStudents;
