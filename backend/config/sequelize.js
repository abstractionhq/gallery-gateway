import Sequelize from 'sequelize'

import config from './index'
import database from './database'

const env = config.get('NODE_ENV')
const dbConfig = database[env]

export default new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
)
