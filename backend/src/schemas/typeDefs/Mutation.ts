import { gql } from "apollo-server-express";

const Mutations = gql`
  type Mutation {
    signup(signup: Signup): String

    addGroup(addGroup: AddGroup): Group

    addFriend(id: Int!): String
    removeFriend(id: Int!): String
    changeFriendStatus(newStatus: FriendStatus): String

    handleMessage(message: InputMessage): Message
    readMessage(read: ReadMessageInput): String
    removeMessage(id: Int!): String
  }
`;

export default [Mutations];
