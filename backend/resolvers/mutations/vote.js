import Vote from '../../models/vote'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function vote (_, args, req) {
  const isRequestingOwnJudgeUser = req.auth.username !== undefined && req.auth.type === JUDGE && req.auth.username === args.input.username
  if (!isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  return Vote.upsert(args.input)
}