import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Student {
  _id: string;
  courses: string[];
  email: string;
  idOnSensor: number;
  matricNo: string;
  name: string;
  __v: number;
}
interface StudentAttendance {
  student: Student;
  time: string;
  _id: string;
}

export interface AttendanceRecord {
  _id: string;
  date: string;
  studentsPresent: StudentAttendance[];
  course: string;
}
interface InitialStateTypes {
  enrolledStudents: { name: string; matricNo: string }[];
  attendanceRecords: AttendanceRecord[];
  isFetchingAttendanceRecords: boolean;
  isFetchingEnrolledStudents: boolean;
  studentAllCourses: any[];
  studentCoursesAttendances: any[];
  studentsOverallAttendance: number | null;
}

const initialState: InitialStateTypes = {
  enrolledStudents: [],
  attendanceRecords: [],
  isFetchingAttendanceRecords: false,
  isFetchingEnrolledStudents: false,
  studentAllCourses: [],
  studentCoursesAttendances: [],
  studentsOverallAttendance: null,
};

const StudentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    AddEnrolledStudents: (
      state,
      action: PayloadAction<{ name: string; matricNo: string }[]>
    ) => {
      state.enrolledStudents = action.payload;
    },
    AddAttendanceRecords(state, action: PayloadAction<any[]>) {
      state.attendanceRecords = action.payload;
    },
    updateIsFetchingAttendanceRecordsState(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isFetchingAttendanceRecords = action.payload;
    },
    updateIsFetchingEnrolledStudentsState(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isFetchingEnrolledStudents = action.payload;
    },
    updateStudentOtherDetails(
      state,
      action: PayloadAction<{
        courses: any[];
        courseAttendances: any[];
        overallAttendancePercentage: number;
      }>
    ) {
      state.studentAllCourses = action.payload.courses;
      state.studentCoursesAttendances = action.payload.courseAttendances;
      state.studentsOverallAttendance =
        action.payload.overallAttendancePercentage;
    },
  },
});
export const {
  AddEnrolledStudents,
  AddAttendanceRecords,
  updateIsFetchingAttendanceRecordsState,
  updateIsFetchingEnrolledStudentsState,
  updateStudentOtherDetails,
} = StudentSlice.actions;
export default StudentSlice.reducer;
