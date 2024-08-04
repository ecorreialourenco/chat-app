import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import styles from "./MessageChat.module.scss";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_GROUP, SEND_MESSAGES } from "src/queries/messages";
import { Message } from "src/models";
import { useParams } from "react-router-dom";
import cn from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "src/store/store";

export const MessageChat = () => {
  const params = useParams();
  const userId = useSelector((state: RootState) => state.auth.id);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [getUserGroup] = useLazyQuery(GET_USER_GROUP);
  const [sendMessage] = useMutation(SEND_MESSAGES);

  const handleSendMessage = () => {
    sendMessage({
      variables: {
        groupId: parseInt(params?.id ?? "0"),
        message: input,
      },
    }).then(({ data }: any) => {
      if (data.handleMessage) {
        setInput("");
        setMessages([...messages, data.handleMessage]);
      }
    });
  };

  useEffect(() => {
    const id = parseInt(params?.id ?? "");
    getUserGroup({ variables: { id } }).then(({ data }) => {
      if (data?.getGroup?.messageList?.messages) {
        const sortedMessages = [...data.getGroup.messageList.messages].sort(
          (a: Message, b: Message) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            if (dateA > dateB) {
              return 1;
            }
            if (dateA < dateB) {
              return -1;
            }

            return 0;
          }
        );
        setMessages(sortedMessages);
      }
    });
  }, []);

  useEffect(() => {
    const objDiv = document.getElementById("chat-container");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      <div id="chat-container" className={styles.chatContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(styles.message, {
              [styles.receiveMessage]: message.userId !== userId,
              [styles.sendMessage]: message.userId === userId,
            })}
          >
            <div className={styles.messageHeader}>
              <span>{message.user.username}</span>
              <span>
                {new Date(message.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div>{message.message}</div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth={true}
        />
        <IconButton onClick={() => handleSendMessage()}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};
