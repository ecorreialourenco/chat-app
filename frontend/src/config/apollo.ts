import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";

const linkHeader = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const clientLink = new HttpLink({
  uri: import.meta.env.VITE_APP_CLIENT,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_APP_WS_CLIENT,
  })
);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  clientLink
);

export const client = new ApolloClient({
  link: linkHeader.concat(link),
  cache: new InMemoryCache(),
});
