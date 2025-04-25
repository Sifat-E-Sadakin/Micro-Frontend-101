const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/WeatherWidget.js",
  output: {
    filename: "widget.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:3001/", // Important for Module Federation to find assets
  },
  devServer: {
    port: 3001,
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
          loader: "babel-loader", // You might need to install this: npm install --save-dev babel-loader @babel/core @babel/preset-env
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
      name: "weather", // Unique name for this microfrontend
      filename: "remoteEntry.js", // The entry point for other applications to consume
      exposes: {
        "./WeatherWidget": "./src/WeatherWidget.js", // Map the component to a public name
      },
    }),
  ],
};
