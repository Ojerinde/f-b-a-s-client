import * as XLSX from "xlsx";
export const createExcelFile = (students: any, modifiedCourseCode: string) => {
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

  if (students.belowOrEqualFiftyPercent.length > 0) {
    students.belowOrEqualFiftyPercent?.forEach(
      (student: any, index: number) => {
        data.push({
          SN: index + 1,
          Name: student.student.name,
          MatricNo: student.student.matricNo,
          AttendancePercentage: student.attendancePercentage + "%",
        });
      }
    );
  }

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

  if (students.aboveFiftyPercent.length > 0) {
    // Add data for students above 50%
    students.aboveFiftyPercent?.forEach((student: any, index: number) => {
      data.push({
        SN: index + 1,
        Name: student.student.name,
        MatricNo: student.student.matricNo,
        AttendancePercentage: student.attendancePercentage + "%",
      });
    });
  }

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
    type: "buffer",
  });
  return excelBuffer;
};
