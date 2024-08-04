import { gql } from "@apollo/client";

export const LOGIN = gql`
  query login($username: String!, $password: String!) {
    login(login: { username: $username, password: $password })
  }
`;
