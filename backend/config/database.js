import config from './index'
import Sequelize from 'sequelize'

const DB = config.get('ABSTRACTION_DB_NAME')
const USER = config.get('ABSTRACTION_DB_USER')
const PASSWORD = config.get('ABSTRACTION_DB_PASS')
const HOST = config.get('ABSTRACTION_DB_HOST')

const Op = Sequelize.Op;
const operatorAliases =  {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

const development = {
  dialect: 'mysql',
  host: HOST,
  database: DB,
  username: USER,
  password: PASSWORD,
  port: 3306,
  operatorAliases: operatorAliases
}

const test = {
  dialect: 'mysql',
  host: HOST,
  database: 'test',
  username: USER,
  password: PASSWORD,
  port: 3306,
  logging: false,
  operatorsAliases: operatorAliases
}

// Additonal exports so that sequelize-cli can read this config properly
module.exports = {
  development,
  test,
  default: {
    development,
    test
  }
}
