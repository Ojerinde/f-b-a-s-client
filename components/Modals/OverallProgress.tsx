import { useAppSelector } from "@/hooks/reduxHook";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MdOutlineClose } from "react-icons/md";

type OverallProgressModalProps = {
  onClose: () => void;
};

ChartJS.register(ArcElement, Tooltip, Legend);

const OverallProgressModal: React.FC<OverallProgressModalProps> = ({
  onClose,
}) => {
  const { studentsOverallAttendance } = useAppSelector(
    (state) => state.students
  );
  console.log("Overall", studentsOverallAttendance);

  //   Chart Logic
  const data = {
    labels: ["Total Attendance Recorded", "Total Attendance Not Recorded"],
    datasets: [
      {
        label: "Percentage",
        data: [
          studentsOverallAttendance,
          `${100 - studentsOverallAttendance!}`,
        ],
        backgroundColor: ["#181b52ed", "#3d3c3c"],
        borderColor: ["#181a40", "#e7e9ea"],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
          },
          color: "#181a40",
        },
      },
    },
  };

  return (
    <div className="overallPerformanceModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default OverallProgressModal;
