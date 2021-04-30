import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import config from './config';

/**
 * Creates a new apollo client for both frontend and backend.
 */
export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: config.USER_GRAPHQL_URL,
    }),
    cache: new InMemoryCache(),
  });
}

// Cached apollo client;
let apolloClient;

/**
 * Initialize the apollo client for the frontend. Do not use this in the backend.
 * For backend use [createApolloClient] instead since it does not require any
 * caching between separate requests.
 */
export function initializeApollo(initialState) {
  apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    // Get existing cache, loaded during client side data fetching.
    const existingCache = apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  return apolloClient;
}
