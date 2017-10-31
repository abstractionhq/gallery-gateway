import User from '../../models/user'
import { JUDGE, STUDENT} from '../../permissionLevels'
export default {
    createJudge: (_, args) => {
        return User.findOne( {where: {username: args.input.username, type: STUDENT}})
        .then((user) => {
            if(user === null){
                const user = {
                    ...args.input,
                    type:  JUDGE,
                };
                return User.create(user);
            } else {
                user.type = JUDGE;
                return user.save();
            }
        })
    }
};