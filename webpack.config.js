
var path = require("path");
var webpack = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var version = require('./package.json').version;
 
/*module.exports = {
  entry: "./src/index.jsx",
  node: {
    fs: "empty"
  },
  output: { path: path.resolve("C:/Users/Pavel/source/repos/avegrade_back/avegrade_back/Scripts"), filename: "bundle.js" },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
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
        }
      ]
  }
};*/

module.exports = {
  entry: "./src/index.jsx",
  node: {
    fs: "empty"
  },
  output: {
    filename: "bundle" + version + ".js",
    chunkFilename: "[name].bundle" + version + ".js",
    publicPath: "/Scripts/",
    path: path.resolve("C:/Users/Pavel/source/repos/avegrade_back/avegrade_back/Scripts")
  },
  mode: 'development',
  plugins: [
		new HtmlWebpackPlugin({
      title: 'My App',
      // Load a custom template (lodash by default see the FAQ for details)
      template: './src/index.html',
      filename: "../index.html"
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
