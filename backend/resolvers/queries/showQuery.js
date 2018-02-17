import Show from '../../models/show'
import Entry from '../../models/entry';
import User from '../../models/user'
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
      return student.getGroups().then((groups) => {
        return getEntriesByGroupOrStudent(groups, args.studentUsername, args.orderBy)
      })
    })
  }

  // Otherwise just show all shows, unordered
  return Show.findAll()
}

function getEntriesByGroupOrStudent(groups, username, orderBy) {
  const groupIds = groups.map(group => group.id)
  //Get by student or group
  if (groupIds.length > 0) {
    return Entry.findAll({
      where: {
        $or: [
          {
            groupId: groupIds
          }, 
          {
            studentUsername: username
          }
        ]
      }
    }).then((entries) => {
      return handleEntriesToReturnShows(entries, orderBy)
    })
  } else {
    return Entry.findAll({ where: { studentUsername: username } })
      .then((entries) => {
        return handleEntriesToReturnShows(entries, orderBy)
      })
  }
}

function handleEntriesToReturnShows(entries, orderBy){
  const showIds = entries.map(entry => entry.showId)
  // If order doesn't matter just return all the shows
  if (!orderBy) {
    return Show.findAll({ where: {id: showIds}})
  } else { // Order shows
    return Show.findAll({
      where: {
        id: showIds
      },
      order: [[args.orderBy.sort, args.orderBy.direction]]
    })
  }
}
