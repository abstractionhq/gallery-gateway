import Show from '../../models/show'
import { ADMIN } from '../../permissionLevels'

export default {
  createShow: (_, args, req) => {
    if (req.auth.type !== ADMIN) {
      throw new UserError('Permission Denied')
    }
    return Show.create(args.input)
  }
}
