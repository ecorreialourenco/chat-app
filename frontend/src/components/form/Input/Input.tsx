import { TextField } from "@mui/material";
import { FC } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  value: string;
  label: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const Input: FC<InputProps> = ({
  value,
  label,
  name,
  onChange,
  required,
  multiline,
  rows,
}) => (
  <TextField
    label={label}
    name={name}
    variant="outlined"
    required={required}
    className={styles.input}
    value={value}
    onChange={onChange}
    margin="normal"
    multiline={multiline}
    rows={(multiline && rows) || 1}
  />
);
