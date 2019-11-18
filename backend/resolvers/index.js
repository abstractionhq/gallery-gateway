import Entry from './types/entryType'
import Photo from './types/photoType'
import Video from './types/videoType'
import OtherMedia from './types/otherMediaType'
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
import * as UserMutations from './mutations/user'
import * as VoteMutations from './mutations/vote'
import * as VoteQuery from './queries/voteQuery'
import * as PortfolioPeriodQuery from './queries/portfolioPeriodQuery'
import * as PortfolioPeriodMutations from './mutations/portfolioPeriod'

export default {
  ...Entry,
  ...Photo,
  ...Video,
  ...OtherMedia,
  ...User,
  ...DateScalar,
  ...Group,
  ...Show,
  ...Vote,
  Query: {
    ...EntryQuery,
    ...UserQuery,
    ...ShowQuery,
    ...VoteQuery,
    ...PortfolioPeriodQuery
  },
  Mutation: {
    ...EntryMutations,
    ...ShowMutations,
    ...UserMutations,
    ...VoteMutations,
    ...PortfolioPeriodMutations
  }
}
