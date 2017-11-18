import Entry from './types/entryType'
import User from './types/userType'
import DateScalar from './types/dateScalar'
import Show from './types/showType'
import * as EntryQuery from './queries/entryQuery'
import * as ShowMutations from './mutations/show'
import * as ShowQuery from './queries/showQuery'
import * as UserQuery from './queries/userQuery'
import * as JudgeMutations from './mutations/judge'

export default {
  ...Entry,
  ...User,
  ...DateScalar,
  ...Show,
  Query: {
    ...EntryQuery,
    ...UserQuery,
    ...ShowQuery
  },
  Mutation: {
    ...ShowMutations,
    ...JudgeMutations
  }
}
