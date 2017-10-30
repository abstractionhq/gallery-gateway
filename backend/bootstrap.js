import nconf from './config'
import sequelize from './config/sequelize'
import models from './models'
import keygen from './keygen'

if (nconf.get('keygen')) {
  console.log('Generating Keys..') // eslint-disable-line no-console
  keygen()
}

models()
sequelize.sync().then(() => sequelize.close())
