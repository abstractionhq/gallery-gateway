let store

if (process.env.NODE_ENV === 'production') {
  store = require('./prod').default
} else {
  store = require('./dev').default
}

export default store
