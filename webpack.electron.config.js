
var path = require("path");
var webpack = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var version = require('./package.json').version;

module.exports = {
  entry: "./src/index.jsx",
  node: {
    fs: "empty"
  },
  output: { path: path.join( __dirname, "out"), filename: "bundle" + version + ".js" },
  mode: "development",
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      // Load a custom template (lodash by default see the FAQ for details)
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "style" + version + ".css",
      chunkFilename: "something.css"
    })
  ],
  module: {
      rules: [
        {
          test: /.jsx$/,
          use: {
            loader: "babel-loader",
            options: {
                presets: ["es2015", "react"]
            }
          }
        },
        {
          test: /.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              'file-loader',
              {
                loader: 'image-webpack-loader',
              },
            ],
          }
      ]
  }
};

/*
module.exports = {
  entry: "./src/index.jsx",
  node: {
    fs: "empty"
  },
  output: { path: path.join( __dirname, "out"), filename: "bundle.js" },
  module: {
      rules: [
        {
          test: /.jsx$/,
          use: {
            loader: "babel-loader",
            options: {
                presets: ["es2015", "react"]
            }
          }
        }
      ]
  }
};*/
