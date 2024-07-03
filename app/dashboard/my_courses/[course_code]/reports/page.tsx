"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import HttpRequest from "@/store/services/HttpRequest";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

interface CourseDetailsReportsProps {
  params: any;
}

const ReportPage: React.FC<CourseDetailsReportsProps> = ({ params }) => {
  const [share, setShare] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [laChecked, setLaChecked] = useState<boolean>(false);
  const [lecturerChecked, setLecturerChecked] = useState<boolean>(false);
  const [studentsChecked, setStudentsChecked] = useState<boolean>(false);

  const [isfetchingReport, setIsFetchingReports] = useState<boolean>(true);
  const [fetchedData, setFetchedData] = useState<{
    aboveFiftyPercent: [];
    belowOrEqualFiftyPercent: [];
    totalEnrolledStudents: null | number;
    lecturer: any;
    la: any;
  }>({
    aboveFiftyPercent: [],
    belowOrEqualFiftyPercent: [],
    totalEnrolledStudents: null,
    lecturer: {},
    la: {},
  });

  const { course_code } = params;
  const modifiedCourseCode = course_code.replace("_", " ").toUpperCase();

  const handleShareClick = () => {
    setShare(!share);
  };

  const handleAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setAllChecked(checked);
    setLaChecked(checked);
    setLecturerChecked(checked);
    setStudentsChecked(checked);
  };

  const createExcelFile = (fetchedData: any, modifiedCourseCode: string) => {
    const data = [];

    data.push({
      SN: "",
      Name: "STUDENTS WITH LESS 50% ATTENDANCE",
      MatricNo: "",
      AttendancePercentage: "",
    });

    data.push({
      SN: "SN",
      Name: "Name",
      MatricNo: "Matric No",
      AttendancePercentage: "Attendance Percentage",
    });

    fetchedData.belowOrEqualFiftyPercent.forEach(
      (student: any, index: number) => {
        data.push({
          SN: index + 1,
          Name: student.student.name,
          MatricNo: student.student.matricNo,
          AttendancePercentage: student.attendancePercentage + "%",
        });
      }
    );

    data.push({
      SN: "",
      Name: "",
      MatricNo: "",
      AttendancePercentage: "",
    });

    // Add header for students above 50%
    data.push({
      SN: "",
      Name: "STUDENTS WITH 50% AND ABOVE ATTENDANCE",
      MatricNo: "",
      AttendancePercentage: "",
    });

    // Add sub-headers for above 50% students
    data.push({
      SN: "SN",
      Name: "Name",
      MatricNo: "Matric No",
      AttendancePercentage: "Attendance Percentage",
    });

    // Add data for students above 50%
    fetchedData.aboveFiftyPercent.forEach((student: any, index: number) => {
      data.push({
        SN: index + 1,
        Name: student.student.name,
        MatricNo: student.student.matricNo,
        AttendancePercentage: student.attendancePercentage + "%",
      });
    });

    // Create the worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data.slice(1));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Report for ${modifiedCourseCode}`
    );

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    return excelBuffer;
  };

  const handleDownload = () => {
    if (
      fetchedData.aboveFiftyPercent.length === 0 &&
      fetchedData.belowOrEqualFiftyPercent.length === 0
    ) {
      return;
    }
    const excelBuffer = createExcelFile(fetchedData, modifiedCourseCode);
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Report for ${modifiedCourseCode}.xlsx`);
  };

  const handleShareSubmit = async () => {
    const selectedInputs = {
      la: laChecked,
      lecturer: lecturerChecked,
      students: studentsChecked,
      email,
    };

    try {
    } catch (error) {}
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsFetchingReports(true);
        const response = await HttpRequest.get(
          `/courses/${modifiedCourseCode}/reports`
        );
        setFetchedData(response.data.data);
        setIsFetchingReports(false);
      } catch (error) {
        toast("Could not fetch course report", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: "#181a40",
            color: "white",
            fontSize: "1.7rem",
            fontFamily: "Poetsen One",
            letterSpacing: "0.15rem",
            lineHeight: "1.7",
            padding: "1rem",
          },
        });
        setIsFetchingReports(false);
      }
    };
    fetchCourses();
  }, []);

  if (isfetchingReport) {
    return <LoadingSpinner height="big"></LoadingSpinner>;
  }

  return (
    <aside className="reportsPage">
      <h1 className="reportsPage-header">{modifiedCourseCode} Report </h1>
      <div className="attendanceItem-header">
        Total Enrolled Students:{" "}
        <span>{fetchedData.totalEnrolledStudents}</span>
      </div>

      <ul>
        <table className="attendanceItem-table">
          <thead>
            <tr>
              <th colSpan={4} className="attendanceItem-table__header">
                {`Students with less than 50% attendance`.toUpperCase()}
              </th>
            </tr>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Matric No</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {fetchedData.belowOrEqualFiftyPercent.map((student: any, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.student.name}</td>
                <td>{student.student.matricNo}</td>
                <td>{student.attendancePercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
      <ul>
        <table className="attendanceItem-table">
          <thead>
            <tr>
              <th colSpan={4} className="attendanceItem-table__header">
                {`Students with 50% and above attendance`.toUpperCase()}
              </th>
            </tr>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Matric No</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {fetchedData.aboveFiftyPercent.map((student: any, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.student.name}</td>
                <td>{student.student.matricNo}</td>
                <td>{student.attendancePercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>

      <div className="reportsPage-actions">
        <button
          onClick={handleDownload}
          disabled={
            fetchedData.aboveFiftyPercent.length === 0 &&
            fetchedData.belowOrEqualFiftyPercent.length === 0
          }
        >
          Download
        </button>
        <button
          onClick={handleShareClick}
          disabled={
            fetchedData.aboveFiftyPercent.length === 0 &&
            fetchedData.belowOrEqualFiftyPercent.length === 0
          }
        >
          {!share ? "Share" : "Share With"}
        </button>
      </div>
      {share && (
        <div className="reportsPage-inputs">
          <div className="checkbox-wrapper-55">
            <label className="rocker rocker-small">
              <input type="checkbox" onChange={handleAllChange} />
              <span className="switch-left">All</span>
              <span className="switch-right">None</span>
            </label>
          </div>
          <div className="checkbox-wrapper-40">
            <label>
              <input
                type="checkbox"
                checked={laChecked}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLaChecked(e.target.checked)
                }
              />
              <span className="checkbox">Level Adviser</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={lecturerChecked}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLecturerChecked(e.target.checked)
                }
              />
              <span className="checkbox">Lecturer</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={studentsChecked}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStudentsChecked(e.target.checked)
                }
              />
              <span className="checkbox">Students</span>
            </label>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Or Enter email address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <button onClick={handleShareSubmit}>Submit</button>
        </div>
      )}
    </aside>
  );
};

export default ReportPage;
