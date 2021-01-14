const HtmlWebPackPlugin = require("html-webpack-plugin");
const PORT = process.env.PORT || "3000";
var path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: ["babel-polyfill", "./src/index.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  output: {
    // path: path.resolve(__dirname, "/var/www/sigobras.com/public"),
    filename: "main.[contenthash].js",
    publicPath: "/",
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: PORT,
    historyApiFallback: true,
    filename: "main.js",
    disableHostCheck: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
};
