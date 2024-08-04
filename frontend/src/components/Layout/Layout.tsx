import { Box } from "@mui/material";
import { FC } from "react";
import { HeaderItem } from "../../models";
import { Header } from "./Header";
import styles from "./Layout.module.scss";
import cn from "classnames";

interface LayoutProps {
  items: HeaderItem[];
  children: React.ReactNode;
  userId: number | null;
}

export const Layout: FC<LayoutProps> = ({ items, userId, children }) => (
  <div className={styles.container}>
    <Header items={items} userId={userId} />

    <Box component="main" className={cn(styles.mainContainer)}>
      {children}
    </Box>
  </div>
);
