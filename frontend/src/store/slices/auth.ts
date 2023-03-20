import { createSlice } from "@reduxjs/toolkit";

interface AuthModel {
  token: string;
  id: string;
}

const initialState: AuthModel = {
  token: "",
  id: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state: AuthModel, action: { payload: string }) => {
      state.token = action.payload;
    },
    setId: (state: AuthModel, action: { payload: string }) => {
      state.id = action.payload;
    },
  },
});

export const { setToken, setId } = authSlice.actions;

export default authSlice.reducer;
