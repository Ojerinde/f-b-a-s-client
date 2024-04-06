import { Course } from "@/app/dashboard/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  courses: Course[];
}

const initialState: InitialStateTypes = {
  courses: [],
};

const CoursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    AddAllCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
  },
});
export const { AddAllCourses } = CoursesSlice.actions;
export default CoursesSlice.reducer;
