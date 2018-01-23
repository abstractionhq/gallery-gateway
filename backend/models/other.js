import Entry from './entry'
import { OTHER_ENTRY } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('other', {
  path: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  instanceMethods: {
    getEntry () {
      return Entry.findOne({
        where: {entryType: OTHER_ENTRY, entryId: this.id}
      })
    }
  }
})
