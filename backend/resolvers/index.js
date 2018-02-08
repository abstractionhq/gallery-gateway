import Entry from './types/entryType'
import User from './types/userType'
import DateScalar from './types/dateScalar'
import Group from './types/groupType'
import Show from './types/showType'
import Vote from './types/voteType'
import * as EntryMutations from './mutations/entry'
import * as EntryQuery from './queries/entryQuery'
import * as ShowMutations from './mutations/show'
import * as ShowQuery from './queries/showQuery'
import * as UserQuery from './queries/userQuery'
import * as JudgeMutations from './mutations/judge'
import * as VoteMutations from './mutations/vote'
import * as VoteQuery from './queries/voteQuery'

export default {
  ...Entry,
  ...User,
  ...DateScalar,
  ...Group,
  ...Show,
  ...Vote,
  Query: {
    ...EntryQuery,
    ...UserQuery,
    ...ShowQuery,
    ...VoteQuery
  },
  Mutation: {
    ...EntryMutations,
    ...ShowMutations,
    ...JudgeMutations,
    ...VoteMutations
  }
}
