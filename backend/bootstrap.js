import fs from 'fs'
import Umzug from 'umzug'

import nconf from './config'
import sequelize from './config/sequelize'
import keygen from './keygen'

export default function bootstrap () {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: { sequelize },
    migrations: {
      path: './db/migrations',
      params: [sequelize.getQueryInterface(), sequelize.constructor]
    }
  })

  if (nconf.get('keygen')) {
    console.log('Generating Keys..') // eslint-disable-line no-console
    keygen()
  }
  if (sequelize.options.storage) {
    fs.closeSync(fs.openSync(sequelize.options.storage, 'w'))
  }

  return umzug.up()
}

if (require.main === module) {
  bootstrap()
    .then(() => sequelize.close())
}
