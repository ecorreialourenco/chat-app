import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isExpired, decodeToken } from "react-jwt";
// Routes
import { AuthRouter, GuestRouter } from "./routes";
// Components
import { Layout } from "./components/Layout";
// Models & Enums
import { HeaderItem, Token } from "./models";
// Store
import { logout, setUser } from "./store/slices/auth";
import { RootState } from "./store/store";
// Styles
import "./App.css";

function App() {
  const storedToken = localStorage.getItem("token") ?? "";
  const { token, id } = useSelector((state: RootState) => state.auth);
  const tokenToDecode = token.length ? token : storedToken;

  const decodedToken: Token | null = decodeToken(tokenToDecode);
  const isExpiredToken = isExpired(tokenToDecode);
  const dispatch = useDispatch();

  const headerItems: HeaderItem[] = token
    ? [
        { label: "Home", link: "/" },
        { label: "Contacts", link: "/contacts" },
        { label: "Messages", link: "/messages" },
      ]
    : [
        { label: "Login", link: "login" },
        { label: "Signup", link: "signup" },
      ];

  useEffect(() => {
    if (!id && decodedToken?.user && !isExpiredToken) {
      const { user } = decodedToken;
      dispatch(setUser({ id: user.id, token: tokenToDecode }));
    } else if ((!decodedToken || isExpiredToken) && id) {
      dispatch(logout());
    }
  }, [dispatch, id, decodedToken, isExpiredToken, token, tokenToDecode]);

  return (
    <Layout items={headerItems} userId={id}>
      {token ? <AuthRouter /> : <GuestRouter />}
    </Layout>
  );
}

export default App;
