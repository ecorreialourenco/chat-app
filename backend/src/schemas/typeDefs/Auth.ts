import { gql } from "apollo-server-express";

const Login = gql`
  input Login {
    username: String!
    password: String!
  }
`;

const Signup = gql`
  input Signup {
    username: String!
    password: String!
    password2: String!
  }
`;

export default [Login, Signup];
