import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
  query listUsers($statusId: Int, $offset: Int, $limit: Int) {
    listUsers(
      filters: { statusId: $statusId, offset: $offset, limit: $limit }
    ) {
      users {
        id
        username
        friends {
          id
          request {
            id
            username
          }
          target {
            id
            username
          }
          status {
            id
            status
          }
        }
      }
      total
    }
  }
`;

export const GET_CONTACTS = gql`
  query listUsers {
    listUsers(filters: {}) {
      users {
        id
        username
        friends {
          id
          request {
            id
            username
          }
          target {
            id
            username
          }
          status {
            id
            status
          }
        }
      }
      total
    }
  }
`;

export const ADD_CONTACT = gql`
  mutation addFriend($id: Int!) {
    addFriend(id: $id)
  }
`;

export const CHANGE_FRIEND_STATUS = gql`
  mutation changeFriendStatus($id: Int!, $statusId: Int!) {
    changeFriendStatus(newStatus: { id: $id, statusId: $statusId })
  }
`;

export const REMOVE_CONTACT = gql`
  mutation removeFriend($id: Int!) {
    removeFriend(id: $id)
  }
`;
