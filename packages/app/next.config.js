const withCustomTranspilation = require('next-transpile-modules')(['lodash-es']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withBundleAnalyzer(
  withSentryConfig(
    withCustomTranspilation({
      productionBrowserSourceMaps: true,
    })
  )
);
