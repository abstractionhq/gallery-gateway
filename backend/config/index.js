import './env' // Needs to be before everything else so that environment variables are loaded first

import config from 'nconf'

import auth from './auth'
import fileUpload from './fileUpload'

config
  .argv()
  .env()
  .use('memory')

config.set('auth', auth)
config.set('upload', fileUpload)
config.set('api:prefix', 'api')
config.set('api:version', 'v1')

config.defaults({
  NODE_ENV: 'development'
})

export default config
