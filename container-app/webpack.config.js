const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: isProduction ? "/" : "http://localhost:3000/",
    },
    devServer: {
      port: 3000,
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
        name: "container",
        remotes: {
          weather: isProduction
            ? "weather@/weather/remoteEntry.js"
            : "weather@http://localhost:3001/remoteEntry.js",
          news: isProduction
            ? "news@/news/remoteEntry.js"
            : "news@http://localhost:3002/remoteEntry.js",
        },
        shared: ["react", "react-dom"],
      }),
    ],
  };
};
