import { gql } from "apollo-server-express";

const Message = gql`
  scalar Date

  type Message {
    id: Int!
    message: String
    userId: Int
    user: User
    createdAt: Date
    updatedAt: Date
  }
`;

const PaginatedMessages = gql`
  type PaginatedMessages {
    messages: [Message]
    total: Int
  }
`;

const InputMessage = gql`
  input InputMessage {
    groupId: Int!
    id: Int
    message: String!
  }
`;

const ReadMessageInput = gql`
  input ReadMessageInput {
    messageIds: [Int!]
  }
`;

export default [Message, InputMessage, ReadMessageInput, PaginatedMessages];
