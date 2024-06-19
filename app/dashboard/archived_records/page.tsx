"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  fetchCourseStudents,
  fetchCourseAttendance,
  fetchArchivedLecturers,
} from "@/store/archived/ArchivedSlice";
import SelectField from "@/components/UI/SelectField/SelectField";
import { Lecturer } from "./types";
import styles from "./archived-records.module.scss";
import Button from "@/components/UI/Button/Button";
import { MdPersonPin } from "react-icons/md";
import Pagination from "@/components/UI/Pagination/Pagination";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";
import AttendanceItem from "@/components/Attendance/AttendanceItem";

const ArchivedRecords: React.FC = () => {
  const [recordToShow, setRecordToShow] = useState<string>("students");
  const [buttonHasBeenClicked, setButtonHasBeenClickedClicked] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { lecturers, students, attendance, loading } = useAppSelector(
    (state) => state.archived
  );
  useEffect(() => {
    dispatch(fetchArchivedLecturers());
  }, [dispatch]);

  const [selectedLecturer, setSelectedLecturer] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleFetchStudents = () => {
    setRecordToShow("students");
    setButtonHasBeenClickedClicked(true);
    if (selectedCourse) {
      dispatch(fetchCourseStudents(selectedCourse.value));
    }
  };

  const handleFetchAttendance = () => {
    setRecordToShow("attendance");
    setButtonHasBeenClickedClicked(true);
    if (selectedCourse) {
      dispatch(fetchCourseAttendance(selectedCourse.value));
    }
  };

  // Prepare options for Select Lecturer dropdown
  const lecturerOptions = lecturers.map((lecturer: Lecturer) => ({
    value: lecturer._id,
    label: lecturer.name,
  }));

  // Prepare options for Select Course dropdown based on selectedLecturer
  const courseOptions = selectedLecturer
    ? lecturers
        .find((lecturer) => lecturer._id === selectedLecturer.value)
        ?.selectedCourses.map((course) => ({
          value: course._id,
          label: `${course.courseCode} - ${course.courseName}`,
        })) || []
    : [];

  /// Pagination logic
  const [start, setStart] = useState(0);
  const studentsPerPage = 15;
  const end = start + studentsPerPage;
  const handlePageChange = (page: number) => {
    const newStart = (page - 1) * studentsPerPage;
    setStart(newStart);
  };

  const [attendanceStart, setAttendanceStart] = useState(0);
  const attendanceRecordsPerPage = 1;
  const attendanceEnd = attendanceStart + attendanceRecordsPerPage;
  const handleAttendancePageChange = (page: number) => {
    const newStart = (page - 1) * attendanceRecordsPerPage;
    setAttendanceStart(newStart);
  };

  return (
    <div className={styles.container}>
      <h2 className="courses-header">Archived Records</h2>
      <div className={styles.selectContainer}>
        <div className={styles.selectContainer_select}>
          <SelectField
            label="Select Lecturer"
            value={selectedLecturer}
            placeholder="Select Lecturer"
            onChange={setSelectedLecturer}
            options={lecturerOptions}
          />
        </div>
        <div className={styles.selectContainer_select}>
          <SelectField
            label="Select Course"
            value={selectedCourse}
            placeholder="Select Course"
            onChange={setSelectedCourse}
            options={courseOptions}
          />
        </div>

        <Button
          type="button"
          disabled={!selectedCourse}
          onClick={handleFetchStudents}
        >
          Fetch Students
        </Button>
        <Button
          type="button"
          disabled={!selectedCourse}
          onClick={handleFetchAttendance}
        >
          Fetch Attendance
        </Button>
      </div>
      <div className={styles.records}>
        {selectedCourse?.value &&
          recordToShow === "students" &&
          !loading &&
          buttonHasBeenClicked &&
          students.length === 0 && (
            <div className="courses-nocourse">
              <RiCreativeCommonsZeroFill />
              <p>No student found.</p>
            </div>
          )}
        {loading && <LoadingSpinner color="blue" height="big" />}

        {!loading && students.length > 0 && recordToShow === "students" && (
          <div className={styles.recordSection}>
            <ul className="enrollmentPage-list">
              {students.slice(start, end).map((student: any) => (
                <li key={student._id}>
                  <div className="enrollmentPage-left">
                    <MdPersonPin />
                    <div>
                      <h3>{student.name}</h3>
                      <h4> {student.matricNo}</h4>
                    </div>
                  </div>
                  <div className="enrollmentPage-left__attendance">
                    Attendance Percentage:{" "}
                    <span>{student.attendancePercentage}%</span>
                  </div>
                </li>
              ))}
            </ul>

            {!loading && students.length > 0 && recordToShow === "students" && (
              <Pagination
                length={students.length}
                itemsPerPage={studentsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}

        {/*  Attendance Records */}
        {selectedCourse?.value &&
          recordToShow === "attendance" &&
          !loading &&
          attendance.length === 0 && (
            <div className="courses-nocourse">
              <RiCreativeCommonsZeroFill />
              <p>No attendance records found.</p>
            </div>
          )}
        {!loading && attendance.length > 0 && recordToShow === "attendance" && (
          <div className={styles.recordSection}>
            <ul className="attendanceItem-list">
              {attendance
                .slice(attendanceStart, attendanceEnd)
                .map((record, index) => (
                  <AttendanceItem
                    key={index}
                    date={record.date}
                    studentsPresent={record.studentsPresent}
                  />
                ))}
            </ul>
            {!loading &&
              attendance.length > 0 &&
              recordToShow === "attendance" && (
                <Pagination
                  length={attendance.length}
                  itemsPerPage={attendanceRecordsPerPage}
                  onPageChange={handleAttendancePageChange}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedRecords;
