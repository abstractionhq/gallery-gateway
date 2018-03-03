const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
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
      'node_modules',
      path.resolve('./src')
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        },
        main: {
          name: 'main',
          test: /[\\/]src[\\/]/
        }
      }
    },
    minimize: true
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      title: 'Gallery Gateway',
      filename: '../index.html',
      template: './src/index.ejs'
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
        loader: ['style-loader', 'css-loader']
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
