import { UserError } from 'graphql-errors'

import User from '../../models/user'
import { ADMIN, JUDGE, STUDENT } from '../../permissionLevels'

export function createJudge (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return User.findOne({where: {username: args.input.username}})
    .then((user) => {
      // The user w/ that username doesn't exist, so create them
      if (user === null) {
        const user = {
          ...args.input,
          type: JUDGE
        }
        return User.create(user)
      }

      throw new UserError('Username Already Exists')
    })
}

export function updatePermissions (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return User.findOne({where: {username: args.input.username}})
    .then((user) => {
      if (user !== null) {
        // A specific type was requested
        if (args.input.type) {
          user.type = args.input.type
          return user.save()
        }

        // No type specified, increase their permissions one level
        switch (user.type) {
          case STUDENT:
            user.type = JUDGE
            return user.save()
          case JUDGE:
            user.type = ADMIN
            return user.save()
          case ADMIN:
            return user
        }
      }

      throw new UserError('User Not Found')
    })
}
