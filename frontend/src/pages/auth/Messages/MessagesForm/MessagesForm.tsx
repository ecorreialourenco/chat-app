import {
  Button,
  Dialog,
  DialogContent,
  SelectChangeEvent,
} from "@mui/material";
import { Box } from "@mui/system";
import { FC, useEffect, useState } from "react";
import { Input } from "../../../../components";
import { UserSelect } from "../UserSelect";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { Chat, Option } from "../../../../models";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER } from "../../../../queries/users";
import { SEND_MESSAGES } from "../../../../queries/messages";
import {
  setChatMessages,
  setToggleFormStatus,
} from "../../../../store/slices/ui";

export const MessagesForm: FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { id } = useSelector((state: RootState) => state.auth);
  const { chat, isFormOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const [getUser, { data: userData }] = useLazyQuery(GET_USER);
  const [sendMessage, { data }] = useMutation(SEND_MESSAGES);

  const handleChange = (e: SelectChangeEvent<Option>) => {
    setSelectedUser(e.target.value as string);
  };

  const handleSendMessage = () => {
    sendMessage({
      variables: {
        message,
        sentBy: id,
        sentTo: selectedUser,
      },
    });

    const isNewUser = !chat.find((msg: Chat) => msg.id === id);
    isNewUser && getUser({ variables: { id }, fetchPolicy: "network-only" });
  };

  useEffect(() => {
    if (data && data.sendMessage) {
      dispatch(setToggleFormStatus(false));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (userData && userData.getUser) {
      const iseUpdated =
        JSON.stringify(userData.getUser.chat) !== JSON.stringify(chat);
      iseUpdated && dispatch(setChatMessages(userData.getUser.chat));
    }
  }, [userData, chat, dispatch]);

  return (
    <Dialog
      onClose={() => dispatch(setToggleFormStatus(false))}
      open={isFormOpen}
      title="New message"
    >
      <DialogContent>
        <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
          <UserSelect
            name="selectUser"
            value={selectedUser}
            onChange={handleChange}
          />
          <Input
            label="Message"
            multiline={true}
            rows={4}
            value={message}
            onChange={(value: string) => setMessage(value)}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
