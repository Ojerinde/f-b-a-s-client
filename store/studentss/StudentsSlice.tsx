import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  enrolledStudents: { name: string; matricNo: string }[];
}

const initialState: InitialStateTypes = {
  enrolledStudents: [],
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
  },
});
export const { AddEnrolledStudents } = StudentSlice.actions;
export default StudentSlice.reducer;
