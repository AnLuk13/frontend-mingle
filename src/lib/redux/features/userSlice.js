import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
      state.userData = null;
    },
  },
});

export const { setUserId, setUser, clearUserId } = userSlice.actions;

export default userSlice.reducer;
