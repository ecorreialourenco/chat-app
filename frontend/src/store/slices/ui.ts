import { createSlice } from "@reduxjs/toolkit";
import { AlertColor } from "@mui/material";

interface UiModel {
  selectedUser: string;
  chatPage: number;
  totalPages: number;
  isFormOpen: boolean;

  alertMessage: string | null;
  alertType: AlertColor;
}

const initialState: UiModel = {
  selectedUser: "",
  chatPage: 0,
  totalPages: 0,
  isFormOpen: false,
  alertMessage: null,
  alertType: "success",
};

export const uiSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedUser: (state: UiModel, action: { payload: string }) => {
      state.selectedUser = action.payload;
    },
    setChatPage: (state: UiModel, action: { payload: number }) => {
      state.chatPage = action.payload;
    },
    setTotalPages: (state: UiModel, action: { payload: number }) => {
      state.totalPages = action.payload;
    },
    setToggleFormStatus: (state: UiModel, action: { payload: boolean }) => {
      state.isFormOpen = action.payload;
    },
    setAlert: (
      state: UiModel,
      action: {
        payload: {
          msg: string | null;
          type: AlertColor;
        };
      }
    ) => {
      state.alertMessage = action.payload.msg;
      state.alertType = action.payload.type;
    },
  },
});

export const {
  setSelectedUser,
  setChatPage,
  setTotalPages,
  setToggleFormStatus,
  setAlert,
} = uiSlice.actions;

export default uiSlice.reducer;
