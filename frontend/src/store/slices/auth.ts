import { createSlice } from "@reduxjs/toolkit";

interface AuthModel {
  token: string;
  id: number | null;
}

const initialState: AuthModel = {
  token: "",
  id: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state: AuthModel,
      action: { payload: { id: number; token: string } }
    ) => {
      const { id, token } = action.payload;
      return { id, token };
    },
    setToken: (state: AuthModel, action: { payload: string }) => {
      state.token = action.payload;
    },
    setId: (state: AuthModel, action: { payload: number }) => {
      state.id = action.payload;
    },
    logout: () => {
      return { id: null, token: "" };
    },
  },
});

export const { setToken, setId, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
