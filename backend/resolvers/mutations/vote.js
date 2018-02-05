import Vote from '../../models/vote'
import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function vote(_, args, req) {
  const isRequestingOwnJudgeUser = req.auth.username !== undefined &&
    req.auth.type === JUDGE && req.auth.username === args.input.judgeUsername
  if (!isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }

  const input = args.input
  User.findById(input.judgeUsername).then(judge => {
    Entry.findById(input.entryId).then(entry => {
      if (!entry) {
        throw new UserError('Cannot find entry with given entrry id')
      }
      judge.getShows().then(shows => {
        if (!shows && shows.id !== entry.showId) {
          throw new UserError(`${input.judgeUsername} is not allowed to vote on this entry`)
        }
      })
    })
  })
  return Vote.upsert(input)
}