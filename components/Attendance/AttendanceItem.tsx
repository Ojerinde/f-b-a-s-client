import {
  compareTimes,
  formatTimeFromISOString,
} from "@/app/dashboard/my_courses/[course_code]/attendance_records/utils";
import { formatDate } from "@/utils/dateFormatter";
import { useState } from "react";

interface AttendanceItemProps {
  date: string | any;
  studentsPresent: any[];
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  date,
  studentsPresent,
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
        <button onClick={toggleSeeAll}>
          {seeAll ? "Collaspe Students" : "See All Students"}
        </button>
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
