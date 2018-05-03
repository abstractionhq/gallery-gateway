// NOTE: This is the entrypoint for Backpack (https://github.com/jaredpalmer/backpack)
import app from '../server'
import nconf from '../config'

const server = app.listen(nconf.get('PORT') || 3000, () => {
  console.log(`Express server listening on port ${server.address().port}`)
})
