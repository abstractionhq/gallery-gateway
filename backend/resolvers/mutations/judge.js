import User from '../../models/user'
import { ADMIN, JUDGE, STUDENT } from '../../permissionLevels'

export function createJudge (_, args) {
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

      throw new Error('Username Already Exists')
    })
}

// TODO: Middleware that checks that the person sending this mutation is an ADMIN
export function updatePermissions (_, args) {
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

      throw new Error('User Not Found')
    })
}
