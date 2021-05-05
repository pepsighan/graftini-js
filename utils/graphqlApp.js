import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import config from './config';

/**
 * Creates a new apollo client for both frontend and ui-backend using the server backend.
 */
export function createAppApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({ uri: config.APP_GRAPHQL_URL }),
    cache: new InMemoryCache(),
  });
}

// Cached apollo client;
let apolloClient;

/**
 * Initialize the apollo client for the frontend. Use [createAppApolloClient] if using in SSR.
 */
export function initializeAppApollo(initialState) {
  apolloClient = apolloClient ?? createAppApolloClient();

  if (initialState) {
    // Get existing cache, loaded during client side data fetching.
    const existingCache = apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  return apolloClient;
}
