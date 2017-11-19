import './env' // Needs to be before everything else so that environment variables are loaded first

import nconf from 'nconf'
import auth from './auth'

nconf
  .argv()
  .env()
  .use('memory')

nconf.set('auth', auth)
nconf.set('api:prefix', 'api')
nconf.set('api:version', 'v1')

nconf.defaults({
  NODE_ENV: 'development'
})

export default nconf
