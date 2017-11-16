import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('entry', {
  entrantType: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  entrantId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  entryType: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  entryId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  },
  moreCopies: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  forSale: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  awardWon: {
    type: DataTypes.TEXT
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
})
