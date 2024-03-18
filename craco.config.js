// craco.config.js

const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  webpack: {
    configure: {
      externals: [webpackNodeExternals()],
    },
  },
};
