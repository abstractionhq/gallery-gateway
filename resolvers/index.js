import UserQuery from './queries/userQuery';
import User from './types/userType';
import DateScalar from './types/dateScalar';
import CreateShow from  './mutations/createShow';

export default {
    ...User,    
    ...DateScalar,
    Query: {
        ...UserQuery,
    },
    Mutation: {
        ...CreateShow,
    },
}