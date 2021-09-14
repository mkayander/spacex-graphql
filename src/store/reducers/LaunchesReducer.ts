import { createSlice } from "@reduxjs/toolkit";

const LaunchesReducer = createSlice({
  name: "test",
  initialState: 0,
  reducers: {
    increment: (state, action) => state + action.payload,
  },
});

export default LaunchesReducer;
