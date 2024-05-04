import React from "react";
import { MdOutlineClose } from "react-icons/md";

type OverallProgressModalProps = {
  onClose: () => void;
  courses: any[];
};

const OverallProgressModal: React.FC<OverallProgressModalProps> = ({
  onClose,
  courses,
}) => {
  return (
    <div className="overallPerformanceModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>Overall progress</h2>
    </div>
  );
};

export default OverallProgressModal;
