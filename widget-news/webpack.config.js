const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/NewsWidget.js",
  output: {
    filename: "widget.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:3002/",
    clean: true,
  },
  devServer: {
    port: 3002,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    liveReload: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    watchFiles: ["src/**/*", "public/**/*"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "news",
      filename: "remoteEntry.js",
      exposes: {
        "./NewsWidget": "./src/NewsWidget.js",
      },
    }),
    new webpack.DefinePlugin({
      "process.env.NEWS_API_KEY": JSON.stringify(
        process.env.NEWS_API_KEY || "YOUR_API_KEY_HERE"
      ),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
