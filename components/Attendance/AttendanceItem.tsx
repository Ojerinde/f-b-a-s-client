interface AttendanceItemProps {
  date: string;
  studentsPresent: any[];
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  date,
  studentsPresent,
}) => {
  return (
    <li className="attendanceItem-item">
      <span>Date: {date}</span>
      <ul>
        {studentsPresent.map((student, index) => (
          <li key={index}>
            <span>Name: {student.name}</span> |{" "}
            <span>Matric No: {student.matricNo}</span>
          </li>
        ))}
      </ul>
    </li>
  );
};
export default AttendanceItem;
