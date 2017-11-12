import Show from '../../models/show'
import User from '../../models/user'

import { UserError } from 'graphql-errors'
import { ADMIN, STUDENT } from '../../permissionLevels'

export function createShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.create(args.input)
}

export function assignToShow (_, args, req) {
  let judges = []
  for (let username of args.usernames) {
    let user = User.findOne({where: {username: username}})
    judges.push(user)
  }
  return Show.findOne({where: {id: args.showId}}).then((show) => {
    if (show !== null) {
      return findJudges(judges).then((judgesList) => {
        return show.addUsers(judgesList)
      })
    } else {
      throw new UserError('Show Not Found')
    }
  }).then(() => { return 'Success' })
}

function findJudges (judges) {
  return Promise.all(judges).then((judgesList) => {
    let usersFound = []
    for (let judge of judgesList) {
      if (judge !== null && judge.type !== STUDENT) {
        usersFound.push(judge)
      }
    }
    if (judges.length === usersFound.length) {
      return usersFound
    } else {
      throw new UserError('Some judges not found. Aborting assignment')
    }
  })
}
