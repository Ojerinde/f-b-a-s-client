import { useAppSelector } from "@/hooks/reduxHook";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

type AllCoursesModalProps = {
  onClose: () => void;
};

const AllCoursesModal: React.FC<AllCoursesModalProps> = ({ onClose }) => {
  const { studentAllCourses } = useAppSelector((state) => state.students);
  console.log("All Course", studentAllCourses);

  return (
    <div className="allCoursesModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>All Courses</h2>

      <ul>
        {studentAllCourses.map((course, index) => (
          <li key={index}>
            <div>
              <h3>{course?.courseName}</h3>
              <p>{course?.courseCode}</p>
            </div>
            <p>Lecturer name: {course?.lecturer.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCoursesModal;
