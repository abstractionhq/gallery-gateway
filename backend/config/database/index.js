const DB = process.env.ABSTRACTION_DBNAME || "database";
const USER = process.env.ABSTRACTION_DBUSER || "root";
const PASSWORD = process.env.ABSTRACTION_DBPASS || "password";
const HOST = process.env.DB_HOST_OVERRIDE || 'localhost';

const development = {
    dialect: 'mysql',
    user: USER,
    password: PASSWORD,
    database: DB,
    host: HOST,
    port: 3306,
};

const test = {
    dialect: 'mysql',
    user: USER,
    password: PASSWORD,
    database: "test",
    host: HOST,
    port: 3306,
}

export default {
  development,
  test,
  migrations: {
    path: 'db/migrations',
  },
};