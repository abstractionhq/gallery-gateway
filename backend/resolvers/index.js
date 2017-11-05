import UserQuery from './queries/userQuery'
import User from './types/userType'
import DateScalar from './types/dateScalar'
import CreateShow from './mutations/createShow'
import * as JudgeMutations from './mutations/judge'

export default {
  ...User,
  ...DateScalar,
  Query: {
    ...UserQuery
  },
  Mutation: {
    ...CreateShow,
    ...JudgeMutations
  }
}
