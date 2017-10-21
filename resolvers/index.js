import UserQuery from './userQuery';
import User from './userType';

export default {
    Query: {
        ...UserQuery,
    },
    ...User,
}