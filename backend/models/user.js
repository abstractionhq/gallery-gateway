import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { STUDENT, ADMIN, JUDGE } from '../constants'

export default sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true,
    primaryKey: true // RIT usernames are unique between individuals and cannot be changed
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  displayName: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM(STUDENT, ADMIN, JUDGE),
    allowNull: false,
    notEmpty: true
  }
})
