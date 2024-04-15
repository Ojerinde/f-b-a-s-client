import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courses/CoursesSlice";
import studentReducer from "./studentss/StudentsSlice";

export const store = configureStore({
  reducer: { courses: courseReducer, students: studentReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
