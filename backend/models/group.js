import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('group', {
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
})
