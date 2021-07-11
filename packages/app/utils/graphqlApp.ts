import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getCurrentFirebaseUser } from 'store/auth';
import config from './config';

/**
 * Creates a new apollo client for both frontend and ui-backend using the server backend.
 */
export function createAppApolloClient() {
  const httpLink = createHttpLink({
    uri: config.APP_GRAPHQL_URL,
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get the token from the currently logged in user if present.
    const token = await (await getCurrentFirebaseUser())?.getIdToken();

    // Send the authorization header.
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
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
