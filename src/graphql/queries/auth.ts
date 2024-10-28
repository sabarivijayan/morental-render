import { gql } from '@apollo/client';

export const FETCH_USER = gql`
  query FetchUser {
    fetchUser {
      status
      message
      data {
        id
        firstName
        lastName
        phoneNumber
        email
        city
        state
        country
        pincode
        profileImage
      }
    }
  }
`;