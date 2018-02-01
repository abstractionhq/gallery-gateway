const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './src/app.js',
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    path: path.join(__dirname, '../', 'dist', 'assets'),
    filename: '[name].[chunkhash].js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'main', async: true, minChunks: 2 }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 8192 }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      title: 'Gallery Gateway',
      filename: '../index.html',
      template: './src/index.ejs'
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      sourceMap: false,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css',
      allChunks: true
    }),
    ...process.env.DEBUG ? [new BundleAnalyzerPlugin({
      analyzerMode: 'server'
    })] : []
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gpl)$/,
        loaders: ['graphql-tag/loader'],
        exclude: /node_moduels/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(['css-loader'])
      },
      {
        test: /\.(gif|png|jpg|jpeg)(\?[a-z0-9]+)?$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  }
}
