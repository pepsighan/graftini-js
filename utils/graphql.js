import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

/**
 * Creates a new apollo client for both frontend and backend.
 */
export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: 'http://127.0.0.3:8080/index.php?graphql',
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
