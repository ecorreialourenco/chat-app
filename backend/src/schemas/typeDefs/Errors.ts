import { gql } from "apollo-server-express";

const Errors = gql`
  type Errors {
    path: String
    message: String
  }
`;

export default [Errors];
