import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_FRIENDS } from "src/queries";
import { UserFriend } from "src/models";
import { ContactsList } from "../../ContactsList";
import { TABLE_LIMIT } from "src/variables";
import { CancelTooltip } from "../components";
import { useDispatch } from "react-redux";
import { setAlert } from "src/store/slices/ui";

interface FriendsModel {
  users: UserFriend[];
  total: number;
}

export const BlockedTab = () => {
  const [friendsList, setFriendsList] = useState<FriendsModel>();
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();

  const [getFriends] = useLazyQuery(GET_FRIENDS, {
    fetchPolicy: "no-cache",
  });

  const getFriendList = () => {
    const offset = TABLE_LIMIT * (page - 1);
    getFriends({
      variables: {
        statusId: 3,
        limit: TABLE_LIMIT,
        offset,
      },
    })
      .then(({ data }) => {
        if (data.listUsers) {
          setFriendsList(data.listUsers);
        }
      })
      .catch(() => {
        dispatch(
          setAlert({
            msg: "Error, please try again later",
            type: "error",
          })
        );
      });
  };

  const handleClick = () => {
    getFriendList();

    dispatch(
      setAlert({
        msg: "Contact blocked",
        type: "success",
      })
    );
  };

  useEffect(() => {
    getFriendList();
  }, [getFriends, page]);

  return (
    <div>
      {friendsList && (
        <ContactsList
          key="blocked-tab"
          list={friendsList.users}
          total={friendsList.total}
          page={page}
          onPageChange={(page: number) => setPage(page)}
          ActionsChildren={(id) => {
            const friend = friendsList.users.find((user) => user.id === id);
            const friendId = friend?.friends[0].id;

            return (
              friendId && <CancelTooltip id={friendId} refetch={handleClick} />
            );
          }}
        />
      )}
    </div>
  );
};
