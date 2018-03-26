import Vote from '../../models/vote'
import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE, STUDENT } from '../../constants'

function judgeIsAllowedToVote (judgeUsername, entryId, userType) {
  // Admins can vote on any show
  if (userType === ADMIN) {
    return Promise.resolve()
  }

  // Students may not vote
  if (userType === STUDENT) {
    return Promise.reject(new UserError('Students may not vote'))
  }

  // Judges may only vote on entries submited to shows they've been assigned to.
  return User.findById(judgeUsername).then(judge => {
    return Entry.findById(entryId).then(entry => {
      if (!entry) {
        return Promise.reject(new UserError('Cannot find entry'))
      }
      return judge.getShows().then(assignedShows => {
        // Make sure the array contains the show this entry is part of
        const allowedToVote = assignedShows.filter(show => show.id === entry.showId)
        if (allowedToVote.length === 0) {
          return Promise.reject(new UserError('Judge is not allowed to vote on this entry'))
        }
        return Promise.resolve()
      })
    })
  })
}

export function vote (_, args, req) {
  // Make sure judge is voting as themself
  const isRequestingOwnJudgeUser = req.auth.username !== undefined &&
    (req.auth.type === JUDGE || req.auth.type === ADMIN) &&
    req.auth.username === args.input.judgeUsername
  if (!isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  // Make sure judge is allowed to vote on this entry
  const input = args.input
  return judgeIsAllowedToVote(input.judgeUsername, input.entryId, req.auth.type)
    .then(() => {
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
          if (created) {
            return vote
          } else {
            return vote.update({ value: input.value })
          }
        })
    })
}
