import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_FRIENDS } from "src/queries";
import { UserFriend } from "src/models";
import { ContactsList } from "../../ContactsList";
import { TABLE_LIMIT } from "src/variables";
import { Alert } from "@mui/material";

import { AcceptTooltip, BlockTooltip, CancelTooltip } from "../components";

interface FriendsModel {
  users: UserFriend[];
  total: number;
}

export const RequestTab = () => {
  const [friendsList, setFriendsList] = useState<FriendsModel>();
  const [page, setPage] = useState<number>(1);
  const [getFriends] = useLazyQuery(GET_FRIENDS, {
    fetchPolicy: "no-cache",
  });

  const getFriendList = () => {
    const offset = TABLE_LIMIT * (page - 1);
    getFriends({
      variables: {
        statusId: 1,
        limit: TABLE_LIMIT,
        offset,
      },
    }).then(({ data }) => {
      if (data.listUsers) {
        setFriendsList(data.listUsers);
      }
    });
  };

  const refetch = (msg: string) => {
    //setALertMessage(msg);
    //setShowAlert(true);
    getFriendList();
  };

  useEffect(() => {
    getFriendList();
  }, [getFriends, page]);

  return (
    <div>
      {friendsList && (
        <ContactsList
          key="requests-tab"
          list={friendsList.users}
          total={friendsList.total}
          page={page}
          onPageChange={(page: number) => setPage(page)}
          ActionsChildren={(id) => {
            const friend = friendsList.users.find((user) => user.id === id);
            const requestedFriend = friend?.friends.find(
              (user) => user.target.id === id
            );
            const targetFriend = friend?.friends.find(
              (user) => user.request.id === id
            );

            if (requestedFriend) {
              return (
                <CancelTooltip id={requestedFriend.id} refetch={refetch} />
              );
            }

            return (
              targetFriend && (
                <>
                  <AcceptTooltip id={targetFriend.id} refetch={refetch} />
                  <BlockTooltip id={targetFriend.id} refetch={refetch} />
                </>
              )
            );
          }}
        />
      )}
    </div>
  );
};
