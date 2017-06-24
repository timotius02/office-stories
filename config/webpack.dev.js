const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = webpackMerge(commonConfig, {
  devtool: "eval-source-map",

  plugins: [
    new BrowserSyncPlugin(
      {
        https: true,
        host: "localhost",
        port: 3000,
        proxy: "https://localhost:3100/",
        https: {
          key: "server.pem",
          cert: "server.pem"
        }
      },
      {
        reload: false
      }
    )
  ],

  devServer: {
    publicPath: "/",
    contentBase: path.resolve("dist"),
    https: {
      key: fs.readFileSync("server.pem"),
      cert: fs.readFileSync("server.pem")
    },
    compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
    port: 3100,
    historyApiFallback: true
  }
});
