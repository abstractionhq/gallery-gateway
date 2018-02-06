import Vote from '../../models/vote'
import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'


function judgeIsAllowedToVote(input) {
  return User.findById(input.judgeUsername).then(judge => {
    return Entry.findById(input.entryId).then(entry => {
      if (!entry) {
        return [false, 'Cannot find entry']
      }
      return judge.getShows().then(assignedShows => {
        // Make sure the array contains the show this entry is part of
        const allowedToVote = assignedShows.filter(show => show.id === entry.showId)
        if (allowedToVote.length === 0) {
          return [false, 'Judge is not allowed to vote on this entry']
        }
        return [true, null]
      })
    })
  })
}
export function vote(_, args, req) {
  // Make sure judge is voting as themself
  const isRequestingOwnJudgeUser = req.auth.username !== undefined &&
    req.auth.type === JUDGE && req.auth.username === args.input.judgeUsername
  if (!isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  // Make sure judge is allowed to vote on this entry
  const input = args.input
  return judgeIsAllowedToVote(input).spread((allowedToVote, errMsg) => {
    if (errMsg) {
      throw new UserError(errMsg)
    }
    if (allowedToVote) {
      return Vote
        .findOrCreate({
          where: {
            judgeUsername: input.judgeUsername,
            entryId: input.entryId
          },
          defaults: {
            value: input.value
          }
        })
        .spread((vote, created) => {
          if(created){
            return vote
          } else {
            return vote.update({value: input.value})
          }
        })
    }
  })
}