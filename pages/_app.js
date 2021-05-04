import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { useMemo } from 'react';
import { initializeFirebase } from 'utils/firebase';
import { initializeApollo } from 'utils/graphql';

initializeFirebase();

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useMemo(() => initializeApollo(pageProps.initialApolloState), [
    pageProps.initialApolloState,
  ]);

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
