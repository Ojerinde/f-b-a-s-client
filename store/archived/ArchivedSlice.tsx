import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";

export interface Lecturer {
  _id: string;
  name: string;
  email: string;
  selectedCourses: Course[];
}

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
}

export interface Student {
  _id: string;
  name: string;
  matricNo: string;
}

export interface Attendance {
  _id: string;
  date: Date;
  studentsPresent: { student: Student; time: string }[];
  course: string;
}

interface ArchivedState {
  lecturers: Lecturer[];
  students: Student[];
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: ArchivedState = {
  lecturers: [],
  students: [],
  attendance: [],
  loading: false,
  error: null,
};

export const fetchArchivedLecturers = createAsyncThunk(
  "archived/fetchArchivedLecturers",
  async () => {
    const response = await HttpRequest.get("/archived_lecturers");
    return response.data;
  }
);

export const fetchCourseStudents = createAsyncThunk(
  "archived/fetchCourseStudents",
  async (courseId: string) => {
    const response = await HttpRequest.get(`/archived_students/${courseId}`);
    return response.data;
  }
);

export const fetchCourseAttendance = createAsyncThunk(
  "archived/fetchCourseAttendance",
  async (courseId: string) => {
    const response = await HttpRequest.get(`/archived_attendance/${courseId}`);
    console.log("response.data", response.data);

    return response.data;
  }
);

const archivedSlice = createSlice({
  name: "archived",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchivedLecturers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchArchivedLecturers.fulfilled,
        (state, action: PayloadAction<Lecturer[]>) => {
          state.loading = false;
          state.lecturers = action.payload;
        }
      )
      .addCase(fetchArchivedLecturers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchCourseStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCourseStudents.fulfilled,
        (state, action: PayloadAction<Student[]>) => {
          state.loading = false;
          state.students = action.payload;
        }
      )
      .addCase(fetchCourseStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchCourseAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCourseAttendance.fulfilled,
        (state, action: PayloadAction<Attendance[]>) => {
          state.loading = false;
          state.attendance = action.payload;
        }
      )
      .addCase(fetchCourseAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default archivedSlice.reducer;
