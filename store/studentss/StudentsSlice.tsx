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
}
interface InitialStateTypes {
  enrolledStudents: { name: string; matricNo: string }[];
  attendanceRecords: AttendanceRecord[];
}

const initialState: InitialStateTypes = {
  enrolledStudents: [],
  attendanceRecords: [],
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
    AddAttendanceRecords: (state, action: PayloadAction<any[]>) => {
      state.attendanceRecords = action.payload.concat(action.payload);
    },
  },
});
export const { AddEnrolledStudents, AddAttendanceRecords } =
  StudentSlice.actions;
export default StudentSlice.reducer;
