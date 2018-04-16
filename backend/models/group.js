import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

import User from './user'

const Group = sequelize.define('group', {
  creatorUsername: {
    allowNull: false,
    type: DataTypes.STRING
  },
  participants: {
    allowNull: false,
    type: DataTypes.STRING
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

/**
 * Gets the creator of this group as a Promise
 */
Group.prototype.getCreator = function getCreator () {
  if (!this.creatorUsername) {
    return Promise.resolve(null)
  }
  return User.findById(this.creatorUsername)
}

export default Group
