import Entry from './types/entryType'
import User from './types/userType'
import DateScalar from './types/dateScalar'
import Group from './types/groupType'
import Show from './types/showType'
import * as EntryMutations from './mutations/entry'
import * as EntryQuery from './queries/entryQuery'
import * as ShowMutations from './mutations/show'
import * as ShowQuery from './queries/showQuery'
import * as UserQuery from './queries/userQuery'
import * as JudgeMutations from './mutations/judge'

export default {
  ...Entry,
  ...User,
  ...DateScalar,
  ...Group,
  ...Show,
  Query: {
    ...EntryQuery,
    ...UserQuery,
    ...ShowQuery
  },
  Mutation: {
    ...EntryMutations,
    ...ShowMutations,
    ...JudgeMutations
  }
}
