import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser($id: String, $offset: Int, $limit: Int) {
    getUser(id: $id) {
      id
      username
      chat(offset: $offset, limit: $limit) {
        total
        chat {
          id
          username
          messages {
            id
            message
            sentBy {
              id
            }
            sentTo {
              id
            }
            date
            status
          }
        }
      }
    }
  }
`;

export const LIST_USERS = gql`
  query {
    listUsers {
      id
      username
    }
  }
`;
