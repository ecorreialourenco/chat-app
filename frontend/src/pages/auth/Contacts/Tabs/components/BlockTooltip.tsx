import { IconButton, Tooltip } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useMutation } from "@apollo/client";
import { CHANGE_FRIEND_STATUS } from "src/queries";

interface BlockTooltipProps {
  id: number;
  refetch: (msg: string) => void;
}

export const BlockTooltip = ({ id, refetch }: BlockTooltipProps) => {
  const [changeFriendsStatus] = useMutation(CHANGE_FRIEND_STATUS);

  const handleChangeStatus = () => {
    changeFriendsStatus({ variables: { id, statusId: 3 } }).then(() =>
      refetch("Contact blocked")
    );
  };

  return (
    <Tooltip title="block" placement="bottom">
      <IconButton onClick={() => handleChangeStatus()}>
        <BlockIcon />
      </IconButton>
    </Tooltip>
  );
};
