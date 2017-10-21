import User from '../models/user'

export default {
    user: (_, args, req) => {
        return User.findById(args.id);
    }, 
    users: () => {
        return User.findAll();
    },
};