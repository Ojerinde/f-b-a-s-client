import React from "react";
import { MdOutlineClose } from "react-icons/md";

type AttendancePerformanceModalProps = {
  onClose: () => void;
  courses: any[];
};

const AttendancePerformanceModal: React.FC<AttendancePerformanceModalProps> = ({
  onClose,
  courses,
}) => {
  return (
    <div className="attendancePerformanceModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>Attendance performance</h2>
    </div>
  );
};

export default AttendancePerformanceModal;
