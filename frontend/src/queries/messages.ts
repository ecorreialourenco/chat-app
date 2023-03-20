import { gql } from "@apollo/client";

export const GET_USER_MESSAGES = gql`
  query getMessages($sentBy: String, $sentTo: String) {
    getMessages(sentBy: $sentBy, sentTo: $sentTo) {
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

export const GET_MESSAGES = gql`
  query listMessages($sentBy: String, $sentTo: String) {
    listMessages(sentBy: $sentBy, sentTo: $sentTo) {
      id
      message
      sentBy {
        id
        username
      }
      sentTo {
        id
        username
      }
      status
      date
    }
  }
`;

export const SEND_MESSAGES = gql`
  mutation sendMessage($message: String, $sentBy: String, $sentTo: String) {
    sendMessage(message: $message, sentBy: $sentBy, sentTo: $sentTo) {
      id
      message
      date
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
