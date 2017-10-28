import UserQuery from './queries/userQuery';
import User from './types/userType';
import DateScalar from './types/dateScalar';
import CreateShow from  './mutations/createShow';
import CreateJudge from './mutations/createJudge';

export default {
    ...User,    
    ...DateScalar,
    Query: {
        ...UserQuery,
    },
    Mutation: {
        ...CreateShow,
        ...CreateJudge,
    },
}