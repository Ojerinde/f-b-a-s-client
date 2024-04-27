"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AttendanceItem from "@/components/Attendance/AttendanceItem";

interface Student {
  _id: string;
  name: string;
  matricNo: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  studentsPresent: Student[];
}

interface AttendancePageProps {
  params: { course_code: string };
}

const AttendancePage: React.FC<AttendancePageProps> = ({ params }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/attendance/${modifiedCourseCode}`
        );
        console.log(response);

        setAttendanceRecords(response.data.attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
      setLoading(false);
    };

    fetchAttendanceRecords();
  }, [params.course_code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="attendanceItem-header">
        Attendance Records for Course {modifiedCourseCode}
      </h2>
      <div className="attendanceItem-input">
        <div>
          <label htmlFor="">From</label>
          <input type="date" />
        </div>
        <div>
          <label htmlFor="">To</label>
          <input type="date" />
        </div>
        <div>
          <input type="text" placeholder="Search for a student" />
        </div>
      </div>
      <ul className="attendanceItem-list">
        {attendanceRecords.map((record, index) => (
          <AttendanceItem
            key={index}
            date={record.date}
            studentsPresent={record.studentsPresent}
          />
        ))}
      </ul>
    </div>
  );
};

export default AttendancePage;
