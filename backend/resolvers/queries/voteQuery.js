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
  // Get all entries on a show 
  return Entry.findAll({
    where: { showId: args.showId }
  }).then((showEntries) => {
    // search for the entires that match the permission constraints
    const entryIds = showEntries.map(entry => entry.id)
    return getVotes(args.judgeUsername, req.auth.type, entryIds)
  })
}

function getVotes(username, authType, entryIds){
  // Give all votes on the show if the user 
  // is an admin and username was not given
  if (authType === ADMIN && !username){
    return Vote.findAll({
      where: { entryId: entryIds }
    })
  } else {
    // Return the votes only for the given judge
    return Vote.findAll({
      where: {
        judgeUsername: username,
        entryId: entryIds
      }
    })
  }
}