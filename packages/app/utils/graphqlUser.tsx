import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { createContext, useContext } from 'react';
import config from './config';

/**
 * Creates a new apollo client for both frontend and ui-backend using the server backend.
 */
export function createUserApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({ uri: config.USER_GRAPHQL_URL }),
    cache: new InMemoryCache(),
  });
}

// Cached apollo client;
let apolloClient;

/**
 * Initialize the apollo client for the frontend. Use [createUserApolloClient] if using in SSR.
 */
export function initializeUserApollo(initialState: any): ApolloClient<NormalizedCacheObject> {
  apolloClient = apolloClient ?? createUserApolloClient();

  if (initialState) {
    // Get existing cache, loaded during client side data fetching.
    const existingCache = apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  return apolloClient;
}

const UserApolloClientContext = createContext<ApolloClient<NormalizedCacheObject> | null>(null);

/**
 * Use this provider to pass in a user specified graphql's apollo client.
 */
export function UserApolloProvider({ client, children }) {
  return (
    <UserApolloClientContext.Provider value={client}>{children}</UserApolloClientContext.Provider>
  );
}

/**
 * Gets the apollo client for the user graphql service.
 */
export function useUserApolloClient(): ApolloClient<NormalizedCacheObject> {
  return useContext(UserApolloClientContext);
}
