import { ApolloProvider } from '@apollo/client';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/system';
import Head from 'next/head';
import { useMemo } from 'react';
import 'utils/firebase';
import { initializeAppApollo } from 'utils/graphqlApp';
import theme from 'utils/theme';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useMemo(
    () => initializeAppApollo(pageProps.initialApolloState),
    [pageProps.initialApolloState]
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
