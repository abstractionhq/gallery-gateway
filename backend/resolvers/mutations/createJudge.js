import User from '../../models/user'
import { JUDGE } from '../../permissionLevels'
export default {
    createJudge: (_, args) => {
        console.log(args.input)
        const user = {
            ...args.input,
            type:  JUDGE,
        };
        return User.create(user);
    }
};