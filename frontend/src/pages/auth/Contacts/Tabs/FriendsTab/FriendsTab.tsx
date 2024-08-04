import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS, REMOVE_CONTACT } from "src/queries";
import { UserFriend } from "src/models";
import { ContactsList } from "../../ContactsList";
import { TABLE_LIMIT } from "src/variables";
import { IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmationDialog } from "../../ConfirmationDialog";

interface FriendsModel {
  users: UserFriend[];
  total: number;
}

export const FriendsTab = () => {
  const [friendsList, setFriendsList] = useState<FriendsModel>();
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>();
  console.log("🚀 ~ FriendsTab ~ selectedFriendId:", selectedFriendId)

  const [getFriends] = useLazyQuery(GET_FRIENDS, {
    fetchPolicy: "no-cache",
  });
  const [removeFriends] = useMutation(REMOVE_CONTACT);

  const getFriendList = () => {
    const offset = TABLE_LIMIT * (page - 1);
    getFriends({
      variables: {
        statusId: 2,
        limit: TABLE_LIMIT,
        offset,
      },
    }).then(({ data }) => {
      if (data.listUsers) {
        setFriendsList(data.listUsers);
      }
    });
  };

  const handleRemoveFriend = () => {
    removeFriends({ variables: { id: selectedFriendId } }).then(() => {
      setTimeout(() => {
        getFriendList();

       /*  setTimeout(() => {
          setIsOpen(false);
          setSelectedFriendId(null);
        }, 100); */
      }, 200);
    });
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedFriendId(null);
  };

  useEffect(() => {
    getFriendList();
  }, [getFriends, page]);

  return (
    <div>
      {friendsList && (
        <ContactsList
          key="friend-tab"
          list={friendsList.users}
          total={friendsList.total}
          page={page}
          onPageChange={(page: number) => setPage(page)}
          ActionsChildren={(id) => (
            <>
              <Tooltip title="Send Message">
                <IconButton /* onClick={() => onAction(row.id)} */>
                  <SendIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove">
                <IconButton
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedFriendId(id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        />
      )}
      <ConfirmationDialog
        isOpen={isOpen}
        title="Do you really want to remove your friend from the list?"
        onSubmit={handleRemoveFriend}
        onCancel={handleCloseDialog}
      />
    </div>
  );
};
