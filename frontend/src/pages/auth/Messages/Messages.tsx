import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../../../models";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Input } from "../../../components";
import { Button } from "@mui/material";
import {
  GET_USER_MESSAGES,
  SEND_MESSAGES,
  SUBSCRIPTION_MESSAGES,
} from "../../../queries/messages";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import styles from "./Messages.module.scss";
import { MessagesForm } from "./MessagesForm";

export const Messages: FC = () => {
  const userMessageId = useParams().id;
  const [message, setMessage] = useState<string>("");
  const { selectedChat } = useSelector((state: RootState) => state.ui);
  const [list, setList] = useState<Message[] | []>([]);
  const { id } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [sendMessage, { data }] = useMutation(SEND_MESSAGES);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [getUserMessages, { data: messagesData }] =
    useLazyQuery(GET_USER_MESSAGES);

  const { data: subscriptionData } = useSubscription(SUBSCRIPTION_MESSAGES, {
    variables: { sentTo: id },
  });

  const handleSendMessage = () => {
    sendMessage({
      variables: {
        message,
        sentBy: id,
        sentTo: userMessageId,
      },
    });
    setMessage("");
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const top = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current?.scrollTo({ top });
    }
  };

  const updateList = useCallback(() => {
    getUserMessages({
      variables: { sentBy: id, sentTo: userMessageId },
      fetchPolicy: "network-only",
    });
  }, [id, userMessageId, getUserMessages]);

  useEffect(() => {
    data && updateList();
  }, [data, updateList]);

  useEffect(() => {
    scrollToBottom();
  }, [list]);

  useEffect(() => {
    userMessageId ? updateList() : navigate("/");
  }, [userMessageId, updateList, navigate]);

  useEffect(() => {
    messagesData && setList(messagesData.getMessages);
  }, [messagesData]);

  useEffect(() => {
    if (subscriptionData && subscriptionData.newMessage) {
      // Check if user receives a new message from the active tab
      subscriptionData.newMessage.message.sentBy.id === userMessageId &&
        updateList();
    }
  }, [subscriptionData, userMessageId, updateList]);

  return (
    <div className={styles.container}>
      <h1>Messages: {selectedChat?.username}</h1>
      {userMessageId && (
        <>
          <div className={styles.messagesList} ref={messagesContainerRef}>
            {list.map((messageItem: Message) => {
              const isOwnMessage = messageItem.sentBy?.id === userMessageId;

              return (
                <div
                  className={
                    !isOwnMessage ? styles.listOwnItem : styles.listItem
                  }
                  key={messageItem.id}
                >
                  <div
                    className={cn(styles.message, {
                      [styles.messageSent]: !isOwnMessage,
                      [styles.messageReceived]: isOwnMessage,
                    })}
                  >
                    {messageItem.message}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.inputContainer}>
            <Input
              label="Message"
              value={message}
              onChange={(value: string) => setMessage(value)}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              className={styles.inputButton}
            >
              Send
            </Button>
          </div>
        </>
      )}

      <MessagesForm />
    </div>
  );
};
