// webpack.config.js

const nodeExternals = require('webpack-node-externals');

module.exports = {
  // other webpack configurations
  externals: [nodeExternals()],
  // other webpack configurations
};
