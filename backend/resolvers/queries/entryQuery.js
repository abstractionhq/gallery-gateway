import Entry from '../../models/entry'
import User from '../../models/user'
import Show from '../../models/show'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function entries (_, args, req) {
  // Make sure an admin, assigned judge, or own user is requesting
  let hasPermissionPromise = Promise.resolve(false)
  const isRequestingOwnUser = req.auth.username !== undefined &&
    req.auth.username === args.studentUsername
  if (isRequestingOwnUser) {
    // everyone can request their own entries
    hasPermissionPromise = Promise.resolve(true)
  } else if (req.auth.type === ADMIN) {
    // admins can do everything
    hasPermissionPromise = Promise.resolve(true)
  } else if (req.auth.type === JUDGE && args.showId) {
    // judges can request the entries for shows to which they're assigned
    hasPermissionPromise = Show.findById(args.showId, {rejectOnEmpty: true})
      .then(show => show.getUsers())
      .then(users =>
        users.map(user => user.username)
          .indexOf(req.auth.username) >= 0
      )
  }

  return hasPermissionPromise.then(hasPermission => {
    if (!hasPermission) {
      throw new UserError('Permission Denied')
    }
    // Get all entries if no args given
    if (!args.showId && !args.studentUsername) {
      return Entry.all()
    } else if (args.showId) { 
      // Get entries by show except those not excluded from judging
      return Entry.findAll({ 
        where: { 
          showId: args.showId,
          excludeFromJudging: false 
        } 
      })
    } else if (args.studentUsername) { // get entries by username
      return User.findById(args.studentUsername).then((student) => {
        return student.getOwnAndGroupEntries()
      })
    } else {
      return Entry.findAll({ where: { args } })
    }
  })
}
