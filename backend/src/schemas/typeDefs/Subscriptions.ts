import { gql } from "apollo-server-express";

const Subscription = gql`
  type Subscription {
    sendRequest(sentTo: Int!): Friend
    updateRequest(sentFrom: Int!): Friend
    newGroup(sentTo: Int!): Group
    newMessage(sentTo: Int!): String
    readMessage(sentTo: Int!): String
  }
`;

export default [Subscription];
