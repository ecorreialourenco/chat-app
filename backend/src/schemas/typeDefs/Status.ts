import { gql } from "apollo-server-express";

const Status = gql`
  type Status {
    id: Int
    username: String
  }
`;

export default [Status];
