import { useLazyQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
// Pages
import { Messages } from "../pages/auth";
import { SUBSCRIPTION_MESSAGES } from "../queries/messages";
import { GET_USER } from "../queries/users";
import { setChatMessages } from "../store/slices/ui";
import { RootState } from "../store/store";

export const AuthRouter = () => {
  const { id } = useSelector((state: RootState) => state.auth);
  const { chat } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const [getUser, { data }] = useLazyQuery(GET_USER);
  const { data: dataMessages } = useSubscription(SUBSCRIPTION_MESSAGES, {
    variables: { sentTo: id },
  });

  useEffect(() => {
    if (dataMessages && dataMessages.newMessage) {
      getUser({ variables: { id }, fetchPolicy: "network-only" });
    }
  }, [dataMessages, getUser, id]);

  useEffect(() => {
    if (data && data.getUser) {
      const iseUpdated =
        JSON.stringify(data.getUser.chat) !== JSON.stringify(chat);
      iseUpdated && dispatch(setChatMessages(data.getUser.chat));
    }
  }, [data, chat, dispatch]);

  return (
    <Routes>
      <Route path="*" element={<Messages />} />
      <Route path="/messages/:id" element={<Messages />} />
    </Routes>
  );
};
