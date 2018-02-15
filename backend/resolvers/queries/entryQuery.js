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
    return Entry.all().each((entry) => {
      return handleEntries(entry)
    })
  } else if (args.showId) { // Get entries by show
    return Entry.findAll({ where: { showId: args.showId } }).each((entry) => {
      return handleEntries(entry)
    })
  } else if (args.studentUsername) { // get entries by username
    return User.findById(args.studentUsername).then((student) => {
      return student.getGroups().then((groups) => {
        return getEntriesByGroupOrStudent(groups, args.studentUsername)
      })
    })
  } else {
    return Entry.findAll({ where: { args } }).each((entry) => {
      return handleEntries(entry)
    })
  }
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
      return handleEntries(entry)
    })
  } else {
    return Entry.findAll({ where: { studentUsername: username } })
      .each((entry) => {
        return handleEntries(entry)
      })
  }
}

function handleEntries(entry) {
  entry.student = entry.getStudent()
  entry.group = entry.getGroup()
  entry.score = entry.getScore()

  if (entry.entryType === IMAGE_ENTRY) {
    return entry.getImage().then((image) => {
      return Object.assign(entry, image.dataValues)
    })
  } else if (entry.entryType === VIDEO_ENTRY) {
    return entry.getVideo().then((video) => {
      return Object.assign(entry, video.dataValues)
    })
  } else if (entry.entryType === OTHER_ENTRY) {
    return entry.getOther().then((other) => {
      return Object.assign(entry, other.dataValues)
    })
  } else {
    throw new Error('unknown entry type')
  }
}
