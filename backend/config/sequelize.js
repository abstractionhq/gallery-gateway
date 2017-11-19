import database from './database'
import Sequelize from 'sequelize'
import nconf from './index'

const env = nconf.get('NODE_ENV')
const dbConfig = database[env]

export default new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
)
