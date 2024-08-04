import { gql } from "apollo-server-express";

const Group = gql`
  type Group {
    id: Int!
    name: String
    users: [User]
    messageList(filters: PaginationFilters): PaginatedMessages
  }
`;

const PaginatedGroups = gql`
  type PaginatedGroups {
    group: [Group]
    total: Int
  }
`;

const AddGroup = gql`
  input AddGroup {
    name: String!
    users: [Int!]!
  }
`;

export default [Group, PaginatedGroups, AddGroup];
