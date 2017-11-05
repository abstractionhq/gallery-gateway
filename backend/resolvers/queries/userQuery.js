import User from '../../models/user'
import { STUDENT, ADMIN, JUDGE } from '../../permissionLevels'


export function user (_, args, req) {
    return User.findById(args.id);
}

export function users (_, args, req) {
    if (args.type === STUDENT) {
        return User.findAll({
            where: {
                type: STUDENT,
            }
        });
    } else if (args.type === JUDGE) {
        return User.findAll({
            where: {
                type: JUDGE,
            }
        });
    } else if (args.type === ADMIN) {
        return User.findAll({
            where: {
                type: ADMIN,
            }
        });
    } else {
        return User.findAll();
    }
}
