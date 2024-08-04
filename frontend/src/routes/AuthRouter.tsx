import { useLazyQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
// Pages
import { Contacts, Home, Messages } from "../pages/auth";
import { SUBSCRIPTION_MESSAGES } from "../queries/messages";
import { GET_USER } from "../queries/users";
import { RootState } from "../store/store";
import { Profile } from "../pages/auth/Profile";
import { MessageChat } from "src/pages/auth/Messages/MessageChat";

export const AuthRouter = () => {
  const { id } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [getUser, { data }] = useLazyQuery(GET_USER);
  const { data: dataMessages } = useSubscription(SUBSCRIPTION_MESSAGES, {
    variables: { sentTo: id },
  });

  useEffect(() => {
    if (dataMessages?.newMessage) {
      getUser({ variables: { id }, fetchPolicy: "network-only" });
    }
  }, [dataMessages, getUser, id]);

  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:id" element={<MessageChat />} />
    </Routes>
  );
};
