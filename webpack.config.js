const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: 'dist/',
  },
  devServer: {
    overlay: true,
  },
  performance: {
     hints: false
   },
  module: {
    rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {presets: ['@babel/preset-env']}
            }
         },{
            test: /\.m?css$/,
             use: ExtractTextPlugin.extract({
                      fallback: "style-loader",
                      use: "css-loader"
                    })
            }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin(),
      new ExtractTextPlugin("styles.css"),
    ]
};
