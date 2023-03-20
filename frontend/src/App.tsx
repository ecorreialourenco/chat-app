import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
// Routes
import { AuthRouter, GuestRouter } from "./routes";
// Components
import { Layout } from "./components/Layout";
// Models & Enums
import { Chat, HeaderItem, Token } from "./models";
import { StatusEnum } from "./enum/status.enum";
// Store
import { setId, setToken } from "./store/slices/auth";
import { RootState } from "./store/store";
import {
  setChatMessages,
  setSelectedChat,
  setTotalPages,
} from "./store/slices/ui";
// Queries
import { GET_USER } from "./queries/users";
import { READ_MESSAGE } from "./queries/messages";
// Styles
import "./App.css";
import { SIDEBAR_OPTIONS_LIMIT } from "./variables/pagination";

function App() {
  const { token, id } = useSelector((state: RootState) => state.auth);
  const { chat, selectedChat, chatPage } = useSelector(
    (state: RootState) => state.ui
  );
  const decodedUser = useJwt(token).decodedToken as Token;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getUser, { data }] = useLazyQuery(GET_USER);
  const [readMessage, { data: dataRead }] = useMutation(READ_MESSAGE);

  const headerItems: HeaderItem[] = token
    ? [{ label: "Home", link: "/" }]
    : [
        { label: "Login", link: "login" },
        { label: "Signup", link: "signup" },
      ];

  const onSelectItem = (value: Chat) => {
    dispatch(setSelectedChat(value));
    navigate(`/messages/${value.id}`);

    const isRead = value.messages
      .filter((item) => item.sentTo?.id === id)
      .every((item) => item.status === StatusEnum.READ);

    if (!isRead) {
      readMessage({ variables: { sentBy: value.id, sentTo: id } });
    }
  };

  const updateUserMessages = useCallback(() => {
    if (decodedUser && decodedUser.user) {
      const { user } = decodedUser;
      getUser({
        variables: {
          id: user.id,
          offset: chatPage,
          limit: SIDEBAR_OPTIONS_LIMIT,
        },
        fetchPolicy: "network-only",
      });
    }
  }, [decodedUser, getUser, chatPage]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, decodedUser]);

  useEffect(() => {
    if (!id && decodedUser && decodedUser.user) {
      const { user } = decodedUser;
      getUser({ variables: { id: user.id } });
      dispatch(setId(user.id));
    } else if (!decodedUser && chat.length && id) {
      dispatch(setChatMessages([]));
      dispatch(setId(""));
    }
  }, [decodedUser, chat, getUser, dispatch, id]);

  useEffect(() => {
    if (data && data.getUser) {
      const isUpdated =
        JSON.stringify(data.getUser.chat.chat) !== JSON.stringify(chat);
      isUpdated && dispatch(setChatMessages(data.getUser.chat.chat));
      isUpdated &&
        dispatch(
          setTotalPages(
            Math.ceil(data.getUser.chat.total / SIDEBAR_OPTIONS_LIMIT)
          )
        );
    }
  }, [data, chat, dispatch]);

  useEffect(() => {
    if (dataRead && dataRead.readMessage) {
      updateUserMessages();
    }
  }, [dataRead, updateUserMessages]);

  useEffect(() => {
    updateUserMessages();
  }, [chatPage, updateUserMessages]);

  return (
    <Layout
      items={headerItems}
      sidebarOptions={chat}
      selectedItem={selectedChat?.id}
      onSelectItem={onSelectItem}
      userId={id}
    >
      {token ? <AuthRouter /> : <GuestRouter />}
    </Layout>
  );
}

export default App;
