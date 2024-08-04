import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HeaderItem } from "../../../models";
import { logout } from "../../../store/slices/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./Header.module.scss";

interface HeaderProps {
  items: HeaderItem[];
  userId?: number | null;
}

export const Header: FC<HeaderProps> = ({ items, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
    handleClose();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRedirect = (url: string) => {
    navigate(url);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          {items.map((item: HeaderItem) => (
            <Link key={item.label} to={item.link} className={styles.link}>
              <Button color="inherit">{item.label}</Button>
            </Link>
          ))}
          {userId && (
            <Box className={styles.link}>
              <IconButton onClick={handleOpenMenu}>
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => handleRedirect("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
