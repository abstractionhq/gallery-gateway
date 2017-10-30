module.exports = {
  parser: 'babel-eslint',
  extends: [
    'react-app',
    'standard',
    'prettier',
    'prettier/standard'
  ],
  plugins: [
    'prettier',
    'standard'
  ],
  'rules': {
    'prettier/standard': 'error'
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.config.prod.js'
      }
    }
  },
};
