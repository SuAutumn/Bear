const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // mode: 'development',
  entry: {
    app: './test/index.jsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  // devtool: 'inline-source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: [
      '.js',
      '.jsx',
      '.ts'
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new ManifestPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        lib: {
          test: /[\\/]src[\\/]lib[\\/]/,
          chunks: 'all',
          name: 'lib',
          minSize: 10,
          filename: '[name].[hash].js'
        }
        // vendor: {
        //   test: /[\\/]node_modules[\\/](?!preact)[\\/]/,
        //   chunks: 'all',
        //   minChunks: 1,
        //   minSize: 1,
        //   name: 'vendor'
        // }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
    // minimizer: [new UglifyJsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
          // options: {
          //   presets: [['@babel/preset-env', {
          //     "targets": {
          //       "chrome": "58",
          //       "ie": "11"
          //     }
          //   }]]
          // }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          // "style-loader", // creates style nodes from JS strings
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader", // translates CSS into CommonJS
          {
            loader: "sass-loader",
            options: {
              outputStyle: 'compressed'
            }
          } // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  }
};
