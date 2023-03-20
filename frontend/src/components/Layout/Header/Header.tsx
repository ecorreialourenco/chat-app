import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HeaderItem } from "../../../models";
import { setToken } from "../../../store/slices/auth";
import { setChatMessages, setSelectedChat } from "../../../store/slices/ui";
import styles from "./Header.module.scss";

interface HeaderProps {
  items: HeaderItem[];
  userId?: string;
}

export const Header: FC<HeaderProps> = ({ items, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setSelectedChat(null));
    dispatch(setChatMessages([]));
    navigate("/");
  };

  return (
    <AppBar component="nav">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          MyChat
        </Typography>
        <Box
          sx={{ display: { xs: "none", sm: "block" } }}
          className={styles.linkContainer}
        >
          {items.map((item: HeaderItem, idx: number) => {
            return (
              <Link key={idx} to={item.link} className={styles.link}>
                <Button color="inherit">{item.label}</Button>
              </Link>
            );
          })}
          {userId && (
            <Box className={styles.link}>
              <Button color="inherit" onClick={() => handleLogout()}>
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
