import { useAppSelector } from "@/hooks/reduxHook";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MdOutlineClose } from "react-icons/md";

type AttendancePerformanceModalProps = {
  onClose: () => void;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendancePerformanceModal: React.FC<AttendancePerformanceModalProps> = ({
  onClose,
}) => {
  const { studentCoursesAttendances } = useAppSelector(
    (state) => state.students
  );
  console.log("Attendance Perfomance", studentCoursesAttendances);

  const data = {
    labels: studentCoursesAttendances.map((course) => course.courseCode),
    datasets: [
      {
        data: studentCoursesAttendances.map(
          (course) => course.attendancePercentage
        ),
        backgroundColor: "#181a50",
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Courses",
          font: {
            size: 20,
          },
          color: "#181a40",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Percentage",
          font: {
            size: 20,
          },
          color: "#181a40",
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="attendancePerformanceModal">
      <div className="" onClick={onClose}>
        <MdOutlineClose className="attendanceOverlay-icon" />
      </div>
      <h2>Attendance Performance For Each Course</h2>
      <Bar options={options} data={data} />
    </div>
  );
};

export default AttendancePerformanceModal;
