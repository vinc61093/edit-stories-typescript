let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
var basePath = __dirname;

module.exports = {
  context: path.join(basePath, 'src'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  entry: {
    app: './index.tsx',
    appStyles: './css/site.css',
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'toastr',
      'lc-form-validation',
      'redux',
      'react-redux',
      'redux-thunk',
    ],
    vendorStyles: [
      '../node_modules/bootstrap/dist/css/bootstrap.css',
      '../node_modules/toastr/build/toastr.css',
    ]

  },
  output: {
    path: path.join(basePath, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/img/[name].[ext]?[hash]'
        }
      },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, loader: 'url-loader?limit=100000' }
    ],
  },
  // For development https://webpack.js.org/configuration/devtool/#for-development
  devtool: 'false',
  devServer: {
    port: 8080,
    noInfo: true,
  },
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
