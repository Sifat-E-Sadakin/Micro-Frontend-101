const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/NewsWidget.js",
  output: {
    filename: "widget.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:3002/", // Different port!
  },
  devServer: {
    port: 3002, // Different port!
    static: {
      directory: path.join(__dirname, "public"),
    },
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "news", // Unique name!
      filename: "remoteEntry.js",
      exposes: {
        "./NewsWidget": "./src/NewsWidget.js", // Map the component
      },
    }),
  ],
};
