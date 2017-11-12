import User from './types/userType'
import DateScalar from './types/dateScalar'
import * as ShowMutations from './mutations/show'
import * as ShowQuery from './queries/showQuery'
import * as UserQuery from './queries/userQuery'
import * as JudgeMutations from './mutations/judge'

export default {
  ...User,
  ...DateScalar,
  Query: {
    ...UserQuery,
    ...ShowQuery
  },
  Mutation: {
    ...ShowMutations,
    ...JudgeMutations
  }
}
