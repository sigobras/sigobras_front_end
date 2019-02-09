const HtmlWebPackPlugin = require("html-webpack-plugin");
const PORT = process.env.PORT || '9009';
var path = require('path');

module.exports = {
  mode: 'production',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [{
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [{
          loader: "file-loader",
          options: {
            outputPath: 'images',
            limit: 4192
          }
        }]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: PORT,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};