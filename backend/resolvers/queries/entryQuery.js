import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../../constants'

export function entries(_, args, req) {
  // Make sure an admin or own user is requesting
  const isRequestingOwnUser = req.auth.username !== undefined &&
    req.auth.username === args.studentUsername
  if (req.auth.type !== ADMIN && !isRequestingOwnUser) {
    throw new UserError('Permission Denied')
  }
  // Get all entries if no args given
  if (!args.showId && !args.studentUsername) {
    return Entry.all()
  } else if (args.showId) { // Get entries by show
    return Entry.findAll({ where: { showId: args.showId } })
  } else if (args.studentUsername) { // get entries by username
    return User.findById(args.studentUsername).then((student) => {
      return student.getOwnAndGroupEntries()
    })
  } else {
    return Entry.findAll({ where: { args } })
  }
}
