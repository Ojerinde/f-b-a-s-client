import React from "react";
import { MdOutlineClose } from "react-icons/md";

type AllCoursesModalProps = {
  onClose: () => void;
  courses: any[];
};

const AllCoursesModal: React.FC<AllCoursesModalProps> = ({
  onClose,
  courses,
}) => {
  return (
    <div className="allCoursesModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>All Courses</h2>
    </div>
  );
};

export default AllCoursesModal;
