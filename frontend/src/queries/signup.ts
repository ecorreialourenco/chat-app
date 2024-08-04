import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation signup(
    $username: String!
    $password: String!
    $password2: String!
  ) {
    signup(
      signup: {
        username: $username
        password: $password
        password2: $password2
      }
    )
  }
`;
