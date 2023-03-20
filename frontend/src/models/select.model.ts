import { SelectChangeEvent } from "@mui/material";

export interface SelectProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: SelectChangeEvent<Option>) => void;
  options: Option[];
}

export interface Option {
  value: string;
  label: string;
}
