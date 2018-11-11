const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/Game.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'PhaserApp'
    }),
    new CopyWebpackPlugin([{ from: './assets', to: './assets' }])
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    publicPath: './dist/assets',
    host: '127.0.0.1',
    port: 8080,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};