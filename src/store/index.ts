import { configureStore } from "@reduxjs/toolkit";
import launchesSlice from "./slices/launchesSlice";
import logger from "redux-logger";
import thunk from "redux-thunk";

export const store = configureStore({
  middleware: [logger, thunk],
  reducer: {
    launches: launchesSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
