"use client";

import { useState } from "react";
import AttendanceItem from "@/components/Attendance/AttendanceItem";
import { useAppSelector } from "@/hooks/reduxHook";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import Pagination from "@/components/UI/Pagination/Pagination";
import { IoSearchCircleSharp } from "react-icons/io5";
import { dummyData, sortByDate } from "./dummy";
import { MdCancel } from "react-icons/md";

interface AttendancePageProps {
  params: { course_code: string };
}

const AttendancePage: React.FC<AttendancePageProps> = ({ params }) => {
  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const { attendanceRecords } = useAppSelector((state) => state.students);

  // Pagination logic
  const [start, setStart] = useState(0);
  const attendanceRecordsPerPage = 5;
  const end = start + attendanceRecordsPerPage;
  const handlePageChange = (num: number) => {
    setStart(num - 1);
  };

  // Filter Logic
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [filteredAttendanceRecords, setfilteredAttendanceRecords] = useState<
    any[]
  >([]);

  const handleFilterByDate = () => {
    const filteredResults = dummyData.filter((obj) => {
      const objDate = new Date(obj.date).getTime();
      const fromTimestamp = new Date(fromDate).getTime();
      const toTimestamp = new Date(toDate).getTime();
      return objDate >= fromTimestamp && objDate <= toTimestamp;
    });
    setfilteredAttendanceRecords(filteredResults);
  };

  const handleFilterByMatricNo = () => {
    const filteredResults = dummyData.filter((obj) => {
      return obj.studentsPresent.some(
        (student) => student.matricNo === matricNo
      );
    });
    setfilteredAttendanceRecords(filteredResults);
  };

  return (
    <div>
      <h2 className="attendanceItem-header">
        Attendance Records for {modifiedCourseCode}
      </h2>

      {dummyData.length === 0 ? (
        <LoadingSpinner color="blue" height="big" />
      ) : (
        <aside>
          <div className="attendanceItem-filter">
            <div className="attendanceItem-input">
              <p>
                <label htmlFor="fromDate">From:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </p>
              <p>
                <label htmlFor="toDate">To:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <button onClick={handleFilterByDate}>Filter</button>
              </p>
            </div>
            <div className="attendanceItem-search">
              <input
                type="text"
                placeholder="Find a Student by Matriculation Number"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
              />
              <IoSearchCircleSharp onClick={handleFilterByMatricNo} />
            </div>
          </div>
          {filteredAttendanceRecords.length !== 0 ? (
            <div>
              <h3 className="attendanceItem-filter__header">
                <span>Filtered results</span>
                <MdCancel onClick={() => setfilteredAttendanceRecords([])} />
              </h3>
              <ul className="attendanceItem-list">
                {sortByDate(filteredAttendanceRecords)
                  .slice(start, end)
                  .map((record, index) => (
                    <AttendanceItem
                      key={index}
                      date={record.date}
                      studentsPresent={record.studentsPresent}
                    />
                  ))}
              </ul>
              <Pagination
                length={sortByDate(filteredAttendanceRecords).length}
                itemsPerPage={attendanceRecordsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div>
              <ul className="attendanceItem-list">
                {sortByDate(dummyData)
                  .slice(start, end)
                  .map((record, index) => (
                    <AttendanceItem
                      key={index}
                      date={record.date}
                      studentsPresent={record.studentsPresent}
                    />
                  ))}
              </ul>
              <Pagination
                length={sortByDate(dummyData).length}
                itemsPerPage={attendanceRecordsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default AttendancePage;
