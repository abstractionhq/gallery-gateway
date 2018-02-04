import Entry from './entry'
import Group from './group'
import User from './user'
import Show from './show'
import Vote from './vote'
export default function () {
  // Many users can be on many shows
  User.belongsToMany(Show, {through: 'user_shows', foreignKey: 'username'})
  Show.belongsToMany(User, {through: 'user_shows'})

  Entry.belongsTo(User, {foreignKey: 'studentUsername'})
  Entry.belongsTo(Group, {foreignKey: 'groupId'})
  Entry.belongsTo(Show, {foreignKey: 'showId'})

  Vote.belongsTo(Entry, {foreignKey: 'entryId'})
  Vote.belongsTo(User, {foreignKey: 'judgeUsername'})



}
