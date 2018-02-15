import Show from '../../models/show'
import Entry from '../../models/entry';
import { UserError } from 'graphql-errors'
import { ADMIN } from '../../constants'

export function show(_, args, req) {
  return Show.findById(args.id)
}

export function shows(_, args, req) {
  // If only order is desired, show all shows ordered
  if (args.orderBy && !args.studentUsername) {
    return Show.findAll({
      order: [[args.orderBy.sort, args.orderBy.direction]]
    })
  }

  // If username given, show all shows the student has submitted to
  if (args.studentUsername) {
    const isRequestingOwnUser = req.auth.username !== undefined &&
      req.auth.username === args.studentUsername
    if (req.auth.type !== ADMIN && !isRequestingOwnUser) {
      throw new UserError('Permission Denied')
    }
    // Get all the shows the student has been on (including as group creator), through entries
    return User.findById(args.studentUsername).then((student) => {
      console.log("found" + student)
      return student.getGroups().then((groups) => {
        return getEntriesByGroupOrStudent(groups, args.studentUsername)
      }).catch((err) => {
        Promise.reject(new UserError('User or group not found'))
      })
    })
  }

  // Otherwise just show all shows, unordered
  return Show.findAll()
}

function getEntriesByGroupOrStudent(groups, username) {
  const groupIds = groups.map(group => group.id)
  //Get by student or group
  if (groupIds.length > 0) {
    return Entry.findAll({
      where: {
        $or: [
          {
            groupId: groupId,
            studentUsername: username
          }
        ]
      }
    }).each((entry) => {
      return handleEntriesToReturnShows(entry)
    })
  } else {
    return Entry.findAll({ where: { studentUsername: username } })
      .each((entry) => {
        return handleEntriesToReturnShows(entry)
      })
  }
}

function handleEntriesToReturnShows(entry){
  const showIds = usernameEntries.map(entry => entry.showId)
  // If order doesn't matter just return all the shows
  if (!args.orderBy) {
    return Show.findAll({ where: {id: showIds}}).each((show) => {
      show.entries = show.getEntries()
    })
  } else { // Order shows
    return Show.findAll({
      where: {
        id: showIds
      },
      order: [[args.orderBy.sort, args.orderBy.direction]]
    }).each((show) => {
      show.entries = show.getEntries()
    })
  }
}
