import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { FC, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "./InputPassword.module.scss";

interface InputPasswordProps {
  value: string;
  name?: string;
  label: string;
  onChange: (value: string, name?: string) => void;
  required?: boolean;
}

export const InputPassword: FC<InputPasswordProps> = ({
  value,
  name,
  label,
  onChange,
  required,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  return (
    <FormControl
      variant="outlined"
      className={styles.container}
      margin="normal"
    >
      <InputLabel>{label}</InputLabel>

      <OutlinedInput
        name={name}
        type={isPasswordVisible ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
              edge="end"
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        value={value}
        required={required}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value, e.target.name)
        }
      />
    </FormControl>
  );
};
