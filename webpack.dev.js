const baseConfig = require('./webpack.config');

module.exports = Object.assign({
  mode: 'development',
  devtool: false,
  watch: true
}, baseConfig)
