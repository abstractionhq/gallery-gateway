import User from '../../models/user';
import { JUDGE, STUDENT, ADMIN} from '../../permissionLevels';
export default {
    createJudge: (_, args) => {
        return User.findOne( {where: {username: args.input.username}})
        .then((user) => {
            if(user === null){
                const user = {
                    ...args.input,
                    type:  JUDGE,
                };
                return User.create(user);
            } else {
                if (user.type === JUDGE || user.type === ADMIN) {
                    return user;
                } else {
                    user.type = JUDGE;
                    return user.save();
                }
            }
        })
    }
};