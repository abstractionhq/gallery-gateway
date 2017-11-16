import User from './user'
import Group from './group'
import Show from './show'
import Entry from './entry'
import Image from './image'

export default function () {
  // Many users can be on many shows
  User.belongsToMany(Show, {through: 'user_shows', foreignKey: 'username'})
  Show.belongsToMany(User, {through: 'user_shows'})

  // Users and groups can make many entires
  Entry.belongsTo(User)
  Entry.belongsTo(Group)
  User.hasMany(Entry)
  Group.hasMany(Entry)

  // Many shows have many entires
  Entry.belongsToMany(Show, {through: 'user_entries', foreignKey: 'username'})
  Show.belongsToMany(Entry, {through: 'user_entries'})

  // Images, Videos, and Other Media are Entries
}
