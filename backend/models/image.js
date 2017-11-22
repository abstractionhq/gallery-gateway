import Entry from './entry'
import { IMAGE_ENTRY } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('image', {
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  horizDimInch: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  vertDimInch: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  mediaType: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  instanceMethods: {
    getEntry () {
      return Entry.findOne({
        where: {entryType: IMAGE_ENTRY, entryId: this.id}
      })
    }
  }
})
