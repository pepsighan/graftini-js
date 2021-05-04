import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAuthListener } from 'store/auth';
import 'utils/firebase';
import { initializeApollo } from 'utils/graphql';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useMemo(() => initializeApollo(pageProps.initialApolloState), [
    pageProps.initialApolloState,
  ]);

  // Listens to the auth changes in the app. If a new user logs in or logs out.
  useAuthListener();

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
