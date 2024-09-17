import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courses/CoursesSlice";
import studentReducer from "./studentss/StudentsSlice";
import Esp32Reducer from "./esp32/Esp32Slice";
import ArchivedReducer from "./archived/ArchivedSlice";
import DeviceReducer from "./devices/DeviceSlice";

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    students: studentReducer,
    esp32: Esp32Reducer,
    archived: ArchivedReducer,
    devices: DeviceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
