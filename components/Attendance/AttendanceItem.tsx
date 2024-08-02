import {
  compareTimes,
  formatTimeFromISOString,
} from "@/app/dashboard/my_courses/[course_code]/attendance_records/utils";
import { formatDate } from "@/utils/dateFormatter";
import { useState } from "react";

interface AttendanceItemProps {
  date: string | any;
  studentsPresent: any[];
  filtered?: boolean;
  attendancePercentage?: number;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  date,
  studentsPresent,
  filtered,
  attendancePercentage,
}) => {
  const [seeAll, setSeeAll] = useState<boolean>(false);

  const toggleSeeAll = () => {
    setSeeAll((prev) => !prev);
  };

  // Create a copy of the studentsPresent array and sort it
  const sortedStudents = [...studentsPresent].sort(compareTimes);

  return (
    <li className="attendanceItem-item">
      <div className="attendanceItem-item__header">
        <p className="attendanceItem-item__date">Date: {formatDate(date)}</p>
        {!filtered && (
          <button onClick={toggleSeeAll}>
            {seeAll ? "See Less" : "See All"}
          </button>
        )}
        {attendancePercentage && (
          <p className="attendanceItem-item__percent">
            Attendance Percentage: <span>{attendancePercentage}%</span>
          </p>
        )}
      </div>

      {seeAll ? (
        <ul>
          <table className="attendanceItem-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Matric No</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.student.name}</td>
                  <td>{record.student.matricNo}</td>
                  <td>{formatTimeFromISOString(record.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ul>
      ) : (
        <ul>
          <table className="attendanceItem-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Matric No</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.slice(0, 1).map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.student.name}</td>
                  <td>{record.student.matricNo}</td>
                  <td>{formatTimeFromISOString(record.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ul>
      )}
    </li>
  );
};
export default AttendanceItem;
