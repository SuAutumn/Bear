const baseConfig = require('./webpack.config');

module.exports = Object.assign({
  mode: 'production',
  devtool: false
}, baseConfig)
