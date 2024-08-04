import { IconButton, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useMutation } from "@apollo/client";
import { CHANGE_FRIEND_STATUS } from "src/queries";

interface AcceptTooltipProps {
  id: number;
  refetch: (msg: string) => void;
}

export const AcceptTooltip = ({ id, refetch }: AcceptTooltipProps) => {
  const [changeFriendsStatus] = useMutation(CHANGE_FRIEND_STATUS);

  const handleChangeStatus = () => {
    changeFriendsStatus({ variables: { id, statusId: 2 } }).then(() =>
      refetch("New friend added")
    );
  };

  return (
    <Tooltip title="Accept" placement="bottom">
      <IconButton onClick={() => handleChangeStatus()}>
        <CheckIcon />
      </IconButton>
    </Tooltip>
  );
};
