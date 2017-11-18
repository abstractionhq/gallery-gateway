import Entry, { IMAGE_ENTRY } from './entry'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('image', {
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  horizDimInch: {
    type: DataTypes.FLOAT
  },
  vertDimInch: {
    type: DataTypes.FLOAT
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
