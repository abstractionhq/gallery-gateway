const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    Main: [
      './src/app.js',
      // 'react-dates' needs to be in the same bundle where it's initialized (See: 'src/index.js')
      'react-dates'
    ],
    Lib: [
      'formik',
      'yup',
      'moment',
      'react-dropzone',
      'react-images',
      'react-moment',
      'react-select',
      'react-table',
      'redux',
      'react-redux',
      'redux-thunk',
      'recompose'
    ],
    React: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'connected-react-router',
      'react-router-tabs'
    ],
    GQL: [
      'apollo-client',
      'apollo-client-preset',
      'graphql',
      'graphql-tag',
      'react-apollo'
    ]
  },
  output: {
    path: path.join(__dirname, '../', 'dist', 'assets'), // Outputs all compiled files to 'dist/assets/<file>.<ext>'
    filename: '[name].[chunkhash].js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: ['.js'], // Matches any file with a '.js' extension
    modules: [
      // Looks for files in './src' and 'node_modules'
      path.resolve('./src'),
      'node_modules'
    ]
  },
  plugins: [
    // Remove the 'dist' folder before building for production
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    }),
    // Give our chunks names
    new webpack.NamedChunksPlugin(),
    // Set 'process.env.NODE_ENV' to 'production'
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // Ignore unused 'moment' locale files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Chunks common dependencies
    new webpack.optimize.CommonsChunkPlugin({ name: ['Lib', 'React', 'GQL'], minChunks: Infinity }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'Main', async: true, minChunks: 2 }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 8192 }),
    // Compiles our template
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      title: 'Gallery Gateway',
      filename: '../index.html',
      template: './src/index.ejs'
    }),
    // Minifies our code
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      }
    }),
    // Moves all CSS to a file
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css',
      allChunks: true
    }),
    // Optionally shows the Bundle Analyzer
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
        exclude: /node_modules/
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
