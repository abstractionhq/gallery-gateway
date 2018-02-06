import Vote from '../../models/vote'
import User from '../../models/user'
import Entry from '../../models/entry'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function votes (_, args, req) {
  const isRequestingOwnJudgeUser = req.auth.username !== undefined &&
  req.auth.type === JUDGE && req.auth.username === args.judgeUsername
  if (req.auth.type !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  return Entry.findAll({
    where: { showId: args.showId }
  }).then((showEntries) => {
    const entryIds = showEntries.map(entry => entry.id)
    return Vote.findAll({
      where: {
        judgeUsername: args.judgeUsername,
        entryId: entryIds
      }
    })
  })
}