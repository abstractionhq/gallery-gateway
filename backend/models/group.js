import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import Entry, { GROUP_ENTRANT } from './entry'

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
},
{
  getterMethods: {
    getEntries () {
      return Entry.findAll({
        where: {entrantType: GROUP_ENTRANT, entrantId: this.id}
      })
    }
  }
})
