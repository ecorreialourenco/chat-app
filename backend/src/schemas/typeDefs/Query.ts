import { gql } from "apollo-server-express";

const Queries = gql`
  type Query {
    login(login: Login): String
    checkUsername(username: String): Boolean

    getGroup(id: Int!): Group
    listGroups(filters: PaginationFilters): PaginatedGroups

    getUser(id: Int!): User
    listUsers(filters: UserFilters): PaginatedUsers
  }
`;

export default [Queries];
