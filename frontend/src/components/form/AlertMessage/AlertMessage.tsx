import { Alert, AlertColor, Snackbar } from "@mui/material";
import { FC } from "react";

interface AlertMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  severity?: AlertColor;
}

export const AlertMessage: FC<AlertMessageProps> = ({
  isOpen,
  onClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
    >
      <Alert
        onClose={onClose}
        severity={severity || "error"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
