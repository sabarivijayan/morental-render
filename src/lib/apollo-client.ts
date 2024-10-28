// lib/client.ts
import { BACKEND_URL } from '@/config/config';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

// Create an upload link for GraphQL
const uploadLink = createUploadLink({
  uri: `${BACKEND_URL}/graphql`,
  credentials: 'same-origin',
});

// Set up the authentication link
const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token'); // Retrieve the token from cookies
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Configure Apollo Client
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Concatenate authLink with uploadLink
  cache: new InMemoryCache(),
});

export default client;
