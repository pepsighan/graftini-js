import { ApolloProvider } from '@apollo/client';
import { CssBaseline, GlobalStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/system';
import AuthStateChangeSync from 'components/AuthStateChangeSync';
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#414768" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <AuthStateChangeSync />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />

        <GlobalStyles
          styles={`
            html {
              font-size: 14px;
            }
          `}
        />
      </ThemeProvider>
    </ApolloProvider>
  );
}
