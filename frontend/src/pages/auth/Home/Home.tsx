import React from "react";
import { Card } from "../../../components";
import { Paper } from "@mui/material";

export const Home = () => {
  return (
    <div>
      <div className="flex justify-center gap-3">
        <Paper elevation={4}>Contacts</Paper>
        <Paper elevation={4}>Messages</Paper>
      </div>
    </div>
  );
};
