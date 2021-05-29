import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { useMemo } from 'react';
import { useAuthListener } from 'store/auth';
import 'utils/firebase';
import { initializeAppApollo } from 'utils/graphqlApp';
import theme from 'utils/theme';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useMemo(
    () => initializeAppApollo(pageProps.initialApolloState),
    [pageProps.initialApolloState]
  );

  // Listens to the auth changes in the app. If a new user logs in or logs out.
  useAuthListener();

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
