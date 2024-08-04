import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export const ConfirmationDialog = ({
  isOpen,
  title,
  onCancel,
  onSubmit,
}: ConfirmationDialogProps) => (
  <Dialog open={isOpen}>
    <DialogTitle> {title}</DialogTitle>
    <DialogContent>
      <Box
        component="form"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Yes
        </Button>
        <Button variant="contained" color="error" onClick={onCancel}>
          No
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);
