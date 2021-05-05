import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import config from './config';

/**
 * Creates a new apollo client for both frontend and backend.
 */
function createApolloClient(uri) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
}

// Cached apollo client;
let apolloClientCache = {
  userClient: null,
  appClient: null,
};

/**
 * Initialize the apollo client for the frontend.
 */
function initializeApollo(initialState, uri, kind) {
  apolloClientCache[kind] = apolloClientCache[kind] ?? createApolloClient(uri);
  const apolloClient = apolloClientCache[kind];

  if (initialState) {
    // Get existing cache, loaded during client side data fetching.
    const existingCache = apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  return apolloClient;
}

export function initializeUserApollo(initialState) {
  return initializeApollo(initialState, config.USER_GRAPHQL_URL, 'userClient');
}

export function createUserApollo() {
  return createApolloClient(config.USER_GRAPHQL_URL);
}

export function initializeAppApollo(initialState) {
  return initializeApollo(initialState, config.APP_GRAPHQL_URL, 'appClient');
}

export function createAppApollo() {
  return createApolloClient(config.APP_GRAPHQL_URL);
}
