import User from './user'
import Show from './show'

export default function () {
  User.belongsToMany(Show, {through: 'user_shows', foreignKey: 'username'})
  Show.belongsToMany(User, {through: 'user_shows'})
}
