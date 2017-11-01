const DB = process.env.ABSTRACTION_DB_NAME
const USER = process.env.ABSTRACTION_DB_USER
const PASSWORD = process.env.ABSTRACTION_DB_PASS
const HOST = process.env.ABSTRACTION_DB_HOST

const development = {
  dialect: 'mysql',
  user: USER,
  password: PASSWORD,
  database: DB,
  host: HOST,
  port: 3306
}

const test = {
  dialect: 'mysql',
  logging: false,
  user: USER,
  password: PASSWORD,
  database: 'test',
  host: HOST,
  port: 3306
}

export default {
  development,
  test,
  migrations: {
    path: 'db/migrations'
  }
}
