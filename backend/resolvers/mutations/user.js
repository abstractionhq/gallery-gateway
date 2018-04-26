import { UserError } from 'graphql-errors'

import User from '../../models/user'
import { ADMIN, JUDGE, STUDENT } from '../../constants'

const createUser = (_, args, req, type) => {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }

  return User.findOne({where: {username: args.input.username}})
    .then((user) => {
      // The user w/ that username doesn't exist, so create them
      if (user === null) {
        const user = {
          ...args.input,
          type
        }
        return User.create(user)
      }

      // Trying to create a user with the same username and role as another user
      if (user.type === type) {
        throw new UserError('Username Already Exists')
      }

      // Students can be elevated to Judges or Admins - No checks needed

      // Judges can be elevated to Admins
      if (user.type === JUDGE && type === STUDENT) {
        throw new UserError('Judges cannot be converted to Students')
      }

      // Admins can't have their role changed
      if (user.type === ADMIN) {
        throw new UserError('Administrators cannot have their role changed')
      }

      user.type = type
      user.firstName = args.input.firstName
      user.lastName = args.input.lastName
      return user.save()
    })
}

export const createAdmin = (_, args, req) => createUser(_, args, req, ADMIN)
export const createJudge = (_, args, req) => createUser(_, args, req, JUDGE)
