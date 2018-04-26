const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    Main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/only-dev-server',
      './src/app.js'
    ],
    Lib: [
      'formik',
      'yup',
      'moment',
      'react-dates',
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
    path: __dirname,
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'], // Matches any file with a '.js' extension
    modules: [
      // Looks for files in './src' and 'node_modules'
      path.resolve('./src'),
      'node_modules'
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    // Allows for hot reloading
    new webpack.HotModuleReplacementPlugin(),
    // Causes the relative path of the module to be displayed when HMR is enabled
    new webpack.NamedModulesPlugin(),
    // Skips the emitting phase whenever there are errors while compiling
    new webpack.NoEmitOnErrorsPlugin(),
    // Set 'process.env.NODE_ENV' to 'development'
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // Compiles our template
    new HtmlWebpackPlugin({
      title: 'Gallery Gateway',
      template: './src/index.ejs'
    })
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
        loaders: ['style-loader', 'css-loader']
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
