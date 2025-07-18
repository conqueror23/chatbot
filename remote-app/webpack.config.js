const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3101,
    allowedHosts: "all",
  },
  output: {
    publicPath: "auto",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "socket.js",
      exposes: {
        "./socket": "./src/shared/socket.ts", // exposed module
      },
      shared: { 
        react: { singleton: true, eager: false }, 
        "react-dom": { singleton: true, eager: false },
        "react/jsx-runtime": { singleton: true, eager: false },
        "socket.io-client": { singleton: true, eager: false }
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};

