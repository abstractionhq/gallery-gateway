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
  return Show.findOne({where: {id: args.showId}}).then((show) => {
    if (show !== null) {
      return show.addUsers(args.usernames).catch(() => {
        throw new UserError('Cannot find one or more usernames')
      })
    } else {
      throw new UserError('Show Not Found')
    }
  }).then(() => { return true })
}
