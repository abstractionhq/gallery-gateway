import User from '../../models/user'
import { ADMIN, JUDGE } from '../../constants'

export default {
  Show: {
    judges (show) {
      return show.getUsers()
    },
    entries (show, _, req) {
      // Admins and judges should see all entries on a show
      if (req.auth.type === ADMIN || req.auth.type === JUDGE) {
        return show.getEntries()
      } else {
        return User.findById(req.auth.username)
          .then((user) => {
            return user.getOwnAndGroupEntries(show.id)
          })
      }
    }
  }
}
