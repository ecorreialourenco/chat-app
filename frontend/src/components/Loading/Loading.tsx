import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";

export const Loading: FC = () => (
  <Box sx={{ display: "flex" }}>
    <CircularProgress />
  </Box>
);
