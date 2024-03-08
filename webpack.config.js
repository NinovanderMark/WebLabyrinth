const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].[chunkhash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      }
    ],
  },
  watchOptions: {
      ignored: /node_modules/,
  },
  devServer: {
      compress: false,
      static: false,
      client: {
          logging: "warn",
          overlay: {
              errors: true,
              warnings: false
          },
          progress: true
      },
      port: 1234, host: "127.0.0.1",
      devMiddleware: {
        writeToDisk: true,
      },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: './src/assets', to: 'assets' },
            { from: './src/css', to:'.' }
        ]
    })
  ],
};