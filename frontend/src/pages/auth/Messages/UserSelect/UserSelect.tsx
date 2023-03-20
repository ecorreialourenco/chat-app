import { useLazyQuery } from "@apollo/client";
import { SelectChangeEvent } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Select } from "../../../../components";
import { Option } from "../../../../models";
import { LIST_USERS } from "../../../../queries/users";

interface UserSelectProps {
  name: string;
  value: any;
  onChange: (e: SelectChangeEvent<Option>) => void;
}

export const UserSelect: FC<UserSelectProps> = ({ name, value, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [listUsers, { data }] = useLazyQuery(LIST_USERS);

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  useEffect(() => {
    if (data && data.listUsers) {
      const userOptions = data.listUsers.map((item: any) => {
        return {
          label: item.username,
          value: item.id,
        };
      });

      setOptions(userOptions);
    }
  }, [data]);

  return (
    <Select
      label="User"
      name={name}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
