import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query {
    getProfile {
      id
      userName
      firstName
      lastName
      isVisible
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: String!
    $userName: String
    $firstName: String
    $lastName: String
    $isVisible: Boolean
  ) {
    updateProfile(
      update: {
        id: $id
        userName: $userName
        firstName: $firstName
        lastName: $lastName
        isVisible: $isVisible
      }
    )
  }
`;
