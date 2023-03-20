import { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select as MSelect,
  MenuItem,
} from "@mui/material";
import { Option, SelectProps } from "../../../models";

export const Select: FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <FormControl fullWidth>
    <InputLabel id={`${name}Label`}>{label}</InputLabel>
    <MSelect
      labelId={`${name}Label`}
      id={name}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option: Option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MSelect>
  </FormControl>
);
