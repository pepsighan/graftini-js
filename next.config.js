const withCustomTranspilation = require('next-transpile-modules')(['lodash-es']);

module.exports = withCustomTranspilation({
  future: {
    webpack5: true,
  },
});
