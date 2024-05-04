import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Student {
  _id: string;
  name: string;
  matricNo: string;
}
export interface AttendanceRecord {
  _id: string;
  date: string;
  studentsPresent: Student[];
  course: string;
}
interface InitialStateTypes {
  enrolledStudents: { name: string; matricNo: string }[];
  attendanceRecords: AttendanceRecord[];
  isFetchingAttendanceRecords: boolean;
  isFetchingEnrolledStudents: boolean;
}

const initialState: InitialStateTypes = {
  enrolledStudents: [],
  attendanceRecords: [],
  isFetchingAttendanceRecords: false,
  isFetchingEnrolledStudents: false,
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
  },
});
export const {
  AddEnrolledStudents,
  AddAttendanceRecords,
  updateIsFetchingAttendanceRecordsState,
  updateIsFetchingEnrolledStudentsState,
} = StudentSlice.actions;
export default StudentSlice.reducer;
