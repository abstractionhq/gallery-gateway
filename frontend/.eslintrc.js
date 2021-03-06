module.exports = {
  parser: 'babel-eslint',
  extends: [
    'react-app',
    'standard'
  ],
  rules: {
    'space-infix-ops': 'off'
  },
  plugins: [
    'prettier',
    'standard'
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.config.prod.js'
      }
    }
  }
}
