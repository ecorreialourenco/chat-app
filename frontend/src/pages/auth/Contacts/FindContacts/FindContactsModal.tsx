import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { FetchResult, useLazyQuery, useMutation } from "@apollo/client";
import { ADD_CONTACT, GET_CONTACTS, REMOVE_CONTACT } from "../../../../queries";
import { ContactsList } from "../ContactsList";
import CloseIcon from "@mui/icons-material/Close";
import { TABLE_LIMIT } from "../../../../variables/pagination";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { UserFriend } from "../../../../models";

interface FindContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddFriendModel {
  addFriend: string;
}

export const FindContactsModal = ({
  isOpen,
  onClose,
}: FindContactsModalProps) => {
  const { id } = useSelector((state: RootState) => state.auth);
  const [contacts, setContacts] = useState<UserFriend[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const totalPages = Math.ceil(total / TABLE_LIMIT);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
    getContacts({ variables: { page } });
  };

  const [getContacts] = useLazyQuery(GET_CONTACTS, {
    fetchPolicy: "network-only",
  });
  const [addContact] = useMutation(ADD_CONTACT);
  const [removeContact] = useMutation(REMOVE_CONTACT);

  const updateContacts = () => {
    getContacts().then(({ data }) => {
      if (data.listUsers) {
        setContacts(data.listUsers.users);
        setTotal(data.listUsers.total);
      }
    });
  };

  const handleContacts = async (contactId: number, type: "add" | "remove") => {
    if (type === "remove") {
      await removeContact({ variables: { id: contactId } }).then(() => {
        updateContacts();
      });
    } else {
      await addContact({ variables: { id: contactId } }).then(
        ({ data }: FetchResult<AddFriendModel>) => {
          if (data?.addFriend === "Request sent!") {
            updateContacts();
          }
        }
      );
    }
  };

  useEffect(() => {
    updateContacts();
  }, []);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Contact list</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
          <ContactsList
            contacts={contacts}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onAction={handleContacts}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
