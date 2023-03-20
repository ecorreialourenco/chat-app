import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation signup($username: String, $password: String) {
    signup(username: $username, password: $password)
  }
`;
