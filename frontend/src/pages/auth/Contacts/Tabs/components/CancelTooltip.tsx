import { IconButton, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useMutation } from "@apollo/client";
import { REMOVE_CONTACT } from "src/queries";

interface CancelTooltipProps {
  id: number;
  refetch: (msg: string) => void;
}

export const CancelTooltip = ({ id, refetch }: CancelTooltipProps) => {
  const [removeFriends] = useMutation(REMOVE_CONTACT);

  const cancelRequest = () => {
    removeFriends({ variables: { id } }).then(() => {
      setTimeout(() => {
        refetch("Request canceled");
      }, 200);
    });
  };

  return (
    <Tooltip title="Cancel" placement="left">
      <IconButton onClick={() => cancelRequest()}>
        <CancelIcon />
      </IconButton>
    </Tooltip>
  );
};
