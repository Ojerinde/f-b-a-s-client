import { useAppSelector } from "@/hooks/reduxHook";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

type AllCoursesModalProps = {
  onClose: () => void;
  student: any;
};

const AllCoursesModal: React.FC<AllCoursesModalProps> = ({
  onClose,
  student,
}) => {
  const { studentAllCourses } = useAppSelector((state) => state.students);

  return (
    <div className="allCoursesModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>{student.matricNo} is enrolled for the following courses:</h2>

      <ul className="allCoursesModal-list">
        {studentAllCourses.map((course, index) => (
          <li key={index} className="allCoursesModal-item">
            <div className="allCoursesModal-item__number">{index + 1}</div>
            <div className="allCoursesModal-item__details">
              <h3>
                {course?.courseName} <span>({course?.courseCode})</span>
              </h3>
              <p>
                Lecturer Name: <span>{course?.lecturer.name}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCoursesModal;
