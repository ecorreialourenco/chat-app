import { Box } from "@mui/material";
import { FC } from "react";
import { HeaderItem } from "../../models";
import { Header } from "./Header";
import styles from "./Layout.module.scss";
import { Sidebar } from "./Sidebar";
import { Chat } from "../../models";
import cn from "classnames";

interface LayoutProps {
  items: HeaderItem[];
  sidebarOptions?: Chat[];
  children: React.ReactNode;
  onSelectItem?: (value: Chat) => void;
  selectedItem?: string | null;
  userId: string;
}

export const Layout: FC<LayoutProps> = ({
  items,
  sidebarOptions,
  onSelectItem,
  selectedItem,
  userId,
  children,
}) => (
  <div className={styles.container}>
    <Header items={items} userId={userId} />
    {userId && sidebarOptions?.length && onSelectItem && (
      <Sidebar
        options={sidebarOptions}
        onSelect={onSelectItem}
        value={selectedItem || ""}
        userId={userId}
      />
    )}
    <Box
      component="main"
      className={cn(styles.mainContainer, {
        [styles.withSidebar]: userId && sidebarOptions?.length,
      })}
    >
      {children}
    </Box>
  </div>
);
