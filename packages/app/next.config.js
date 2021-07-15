const withCustomTranspilation = require('next-transpile-modules')(['lodash-es']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');
const withPlugins = require('next-compose-plugins');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = withPlugins([
  withBundleAnalyzer,
  [withSentryConfig, {}, [PHASE_PRODUCTION_BUILD]],
  [withCustomTranspilation, { productionBrowserSourceMaps: true }],
]);
