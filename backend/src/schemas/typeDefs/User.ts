import { gql } from "apollo-server-express";

const User = gql`
  type User {
    id: Int
    username: String
    friends: [Friend]
  }
`;

const PaginatedUsers = gql`
  type PaginatedUsers {
    users: [User]
    total: Int
  }
`;

const UserFilters = gql`
  input UserFilters {
    statusId: Int
    notStatusId: Int
    offset: Int
    limit: Int
  }
`;

export default [User, PaginatedUsers, UserFilters];
