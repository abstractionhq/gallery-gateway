import Vote from '../../models/vote'
import User from '../../models/user'
import Entry from '../../models/entry'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function votes (_, args, req) {
  const isRequestingOwnJudgeUser = req.auth.username !== undefined && req.auth.type === JUDGE && req.auth.username === args.id
  if (req.auth.type !== ADMIN && !isRequestingOwnUser) {
    throw new UserError('Permission Denied')
  }
  return Vote.findAll({
    include:[
      {
        model: User, where: { username: args.username }
      },
      {
        model: Entry, where: { showId: args.showId }
      }
    ]
  })
}