import { createSlice } from "@reduxjs/toolkit";
import { Chat } from "../../models/messages.model";

interface UiModel {
  chat: Chat[];
  selectedChat: Chat | null;
  selectedUser: string;
  chatPage: number;
  totalPages: number;
  isFormOpen: boolean;
}

const initialState: UiModel = {
  chat: [],
  selectedChat: null,
  selectedUser: "",
  chatPage: 0,
  totalPages: 0,
  isFormOpen: false,
};

export const uiSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setChatMessages: (state: UiModel, action: { payload: Chat[] }) => {
      state.chat = action.payload;
    },
    setSelectedChat: (state: UiModel, action: { payload: Chat | null }) => {
      state.selectedChat = action.payload;
    },
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
  },
});

export const {
  setChatMessages,
  setSelectedChat,
  setSelectedUser,
  setChatPage,
  setTotalPages,
  setToggleFormStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
