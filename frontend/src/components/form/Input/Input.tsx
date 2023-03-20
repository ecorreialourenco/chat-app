import { TextField } from "@mui/material";
import { FC } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  value: string;
  label: string;
  name?: string;
  onChange: (val: string, name?: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const Input: FC<InputProps> = ({
  value,
  label,
  onChange,
  required,
  multiline,
  rows,
}) => (
  <TextField
    label={label}
    variant="outlined"
    required={required}
    className={styles.input}
    value={value}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value, e.target.name)
    }
    margin="normal"
    multiline={multiline}
    rows={(multiline && rows) || 1}
  />
);
