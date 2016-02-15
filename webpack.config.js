var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: "./src/app.js",
    //style: "./src/style.js",
  },
  output: {
    filename: '[name].js',
    path: "./public",
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.tsx?$/,
        loaders: ['babel', 'ts'],
        exclude: /(node_modules|bower_components)/,
      },
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.json$/, loader: 'json' },
    ],
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader: 'transform/cacheable?brfs'
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    modulesDirectories: ['node_modules', 'bower_components'],
    root: path.join(__dirname, 'src'),
  },
  devServer: {
    contentBase: "./public",
    port: 1234,
    hot: true,
    inline: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
};
