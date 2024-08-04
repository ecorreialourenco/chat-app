import { FC } from "react";
import {
  Drawer,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import cn from "classnames";
import styles from "./Sidebar.module.scss";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setChatPage, setToggleFormStatus } from "../../../store/slices/ui";

interface SidebarProps {
  value: number | null;
  options: any[];
  onSelect: (value: any) => void;
  userId: number;
}

export const Sidebar: FC<SidebarProps> = ({
  value,
  options,
  onSelect,
  userId,
}) => {
  const { chatPage, totalPages } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <Drawer
      anchor="left"
      open={options.length > 0}
      variant="permanent"
      className={styles.sidebar}
    >
      <Toolbar />
      {options.map((item: any, idx: number) => {
        const isRead = true

        return (
          <ListItem key={idx} disablePadding onClick={() => onSelect(item)}>
            <ListItemButton selected={value === item.id}>
              <ListItemText
                primary={item.username}
                className={cn({
                  [styles.newMessage]: !isRead,
                })}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
      {totalPages > 1 && (
        <ListItem disablePadding>
          <ListItemButton
            disabled={chatPage < 1}
            onClick={() => {
              dispatch(setChatPage(chatPage - 1));
            }}
          >
            <ListItemText primary={<NavigateBeforeIcon />} />
          </ListItemButton>
          <ListItemButton
            disabled={chatPage >= totalPages}
            onClick={() => {
              dispatch(setChatPage(chatPage + 1));
            }}
          >
            <ListItemText primary={<NavigateNextIcon />} />
          </ListItemButton>
        </ListItem>
      )}
      <ListItem
        disablePadding
        onClick={() => dispatch(setToggleFormStatus(true))}
      >
        <ListItemButton>
          <ListItemText primary="New message" />
        </ListItemButton>
      </ListItem>
    </Drawer>
  );
};
