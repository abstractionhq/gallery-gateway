import Sequelize from 'sequelize'

export default new Sequelize(
  process.env.ABSTRACTION_DB_NAME,
  process.env.ABSTRACTION_DB_USER,
  process.env.ABSTRACTION_DB_PASS, {
    host: process.env.ABSTRACTION_DB_HOST,
    dialect: 'mysql'
  }
)
