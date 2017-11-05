import User from './types/userType'
import DateScalar from './types/dateScalar'
import CreateShow from './mutations/createShow'
import * as ShowQuery from './queries/ShowQuery'
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
    ...CreateShow,
    ...JudgeMutations
  }
}
