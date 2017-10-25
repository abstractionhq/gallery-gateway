module.exports = {
  globals: {
    gapi: true,
  },
  extends: [
    "sse",
  ],
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
  },
  ecmaFeatures: {
    jsx: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: "webpack.config.prod.js"
      }
    }
  },
};
