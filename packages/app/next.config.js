const withCustomTranspilation = require('next-transpile-modules')(['lodash-es']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withCustomTranspilation({
    productionBrowserSourceMaps: true,
    future: {
      webpack5: true,
    },
  })
);
