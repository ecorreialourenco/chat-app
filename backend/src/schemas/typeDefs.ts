import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum StatusEnum {
    SEND
    READ
  }

  type User {
    id: String!
    username: String
    chat(offset: Int, limit: Int): PaginatedChat
  }

  type PaginatedChat {
    chat: [Chat]
    total: Int
  }

  type Chat {
    id: String!
    username: String
    messages: [Message]
    total: Int
  }

  type Message {
    id: String!
    message: String
    sentBy: User
    sentTo: User
    status: String
    date: String
  }

  type SubscriptionMessage {
    message: Message
  }

  type ReadMessages {
    messages: [Message]
    sentTo: String
    sentBy: String
  }

  type Query {
    login(username: String, password: String): String
    getUser(id: String): User
    listUsers: [User]
    getMessages(sentBy: String, sentTo: String): [Message]
    listMessages(id: String): [Message]
  }

  type Mutation {
    signup(username: String, password: String): String
    sendMessage(message: String, sentBy: String, sentTo: String): Message
    readMessage(sentBy: String!, sentTo: String!): [Message]

    cleanData: String
    insertUsersMock: String
    insertMessagesMock: String
  }

  type Subscription {
    newMessage(sentTo: String!): SubscriptionMessage
    readMessage(sentTo: String!): ReadMessages
  }
`;

export default typeDefs;
