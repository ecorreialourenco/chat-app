import { gql } from "apollo-server-express";

const PaginationFilters = gql`
  input PaginationFilters {
    offset: Int
    limit: Int
  }
`;

export default [PaginationFilters];
