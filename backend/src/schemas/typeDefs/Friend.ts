import { gql } from "apollo-server-express";

const Friend = gql`
  type Friend {
    id: Int!
    request: User
    target: User
    status: Status
  }
`;

const Status = gql`
  input Status {
    id: Int!
    status: String
  }
`;

const FriendStatus = gql`
  input FriendStatus {
    id: Int!
    statusId: Int!
  }
`;

export default [Friend, Status, FriendStatus];
