import { gql } from "@apollo/client";

export const LIST_USER_GROUPS = gql`
  query listGroups($offset: Int, $limit: Int) {
    listGroups(filters: { offset: $offset, limit: $limit }) {
      group {
        id
        name
        users {
          id
        }
      }
      total
    }
  }
`;

export const GET_USER_GROUP = gql`
  query getGroup($id: Int!) {
    getGroup(id: $id) {
      id
      name
      users {
        id
        username
      }
      messageList(filters: {}) {
        messages {
          id
          message
          userId
          user {
            id
            username
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const SEND_MESSAGES = gql`
  mutation sendMessage($groupId: Int!, $message: String!) {
    handleMessage(message: { groupId: $groupId, message: $message }) {
      id
      message
      userId
      user {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation readMessage($sentBy: String!, $sentTo: String!) {
    readMessage(sentBy: $sentBy, sentTo: $sentTo) {
      id
      message
      sentBy {
        id
      }
      sentTo {
        id
      }
    }
  }
`;

export const SUBSCRIPTION_MESSAGES = gql`
  subscription NewMessage($sentTo: String!) {
    newMessage(sentTo: $sentTo) {
      message {
        id
        message
        sentBy {
          id
        }
      }
    }
  }
`;

export const SUBSCRIPTION_READ_MESSAGES = gql`
  subscription readMessage($id: String) {
    readMessage(sentTo: $id) {
      messages {
        id
      }
      sentTo
      sentBy
    }
  }
`;
