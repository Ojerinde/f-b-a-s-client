import { formatDate } from "@/utils/dateFormatter";
import { useState } from "react";

interface AttendanceItemProps {
  date: string;
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
              </tr>
            </thead>
            <tbody>
              {studentsPresent.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.matricNo}</td>
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
              </tr>
            </thead>
            <tbody>
              {studentsPresent.slice(0, 1).map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.matricNo}</td>
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
