import Show from '../../models/show'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN } from '../../constants'

const isRequestingOwnUser = (req, args) => {
  return req.auth.username !== undefined &&
    req.auth.username === args.studentUsername
}

export function show (_, args, req) {
  return Show.findById(args.id)
}

export function shows (_, args, req) {
  // Students can only look at their own shows
  if (args.studentUsername && req.auth.type !== ADMIN && !isRequestingOwnUser(req, args)) {
    throw new UserError('Permission Denied')
  }

  // If only order is desired, show all shows ordered
  const order = args.orderBy ? {order: [[args.orderBy.sort, args.orderBy.direction]]} : {}
  // If username given, show all shows the student has submitted to
  if (args.studentUsername) {
    const entryStart = req.auth.type !== ADMIN ? { entryStart: {$lt: new Date()} } : {}
    // Get all the shows the student has been on
    // (including as group creator), through entries
    return User.findById(args.studentUsername).then((student) => {
      return student.getOwnAndGroupEntries()
        // Find all connected shows
        .then((entries) => {
          const showIds = entries.map(entry => entry.showId)
          const whereShowIds = { where: { id: showIds } }
          return Show.findAll(Object.assign({}, whereShowIds, order, entryStart))
        })
    })
  }

  // Otherwise just show all shows, unordered
  return Show.findAll()
}
