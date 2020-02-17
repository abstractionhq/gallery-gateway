import Group from './group'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { STUDENT, ADMIN, JUDGE } from '../constants'
import Entry from './entry'

const User = sequelize.define('user', {
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
  hometown: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(STUDENT, ADMIN, JUDGE),
    allowNull: false,
    notEmpty: true
  }
})

User.prototype.getGroups = function getGroups () {
  if (this.type !== STUDENT) {
    return Promise.resolve([])
  }
  // Find all groups where the creator is this user
  return Group.findAll({ where: { creatorUsername: this.username } })
}

User.prototype.getOwnAndGroupEntries = function getOwnAndGroupEntries (showIds = null) {
  if (this.type !== STUDENT) {
    return Promise.resolve([])
  }
  // Find all entries where this user is the submitter (group and self)
  return this.getGroups()
    .then((groups) => {
      const groupIds = groups.map(group => group.id)
      if (showIds) {
        return Entry.findAll({ where: { $or: [{ groupId: groupIds }, { studentUsername: this.username }], showId: showIds } })
      } else {
        return Entry.findAll({ where: { $or: [{ groupId: groupIds }, { studentUsername: this.username }] } })
      }
    })
}

export default User
