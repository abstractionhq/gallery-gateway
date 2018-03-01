import User from '../../models/user'
import Entry from '../../models/entry'
import Vote from '../../models/vote'
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
    },
    ownVotes (show, _, req) {
      return Entry.findAll({ where: { showId: show.id } }).then((showEntries) => {
        // search for the entires that match the permission constraints
        const entryIds = showEntries.map(entry => entry.id)
        return Vote.findAll({
          where: {
            judgeUsername: req.auth.username,
            entryId: entryIds
          }
        })
      })
    }
  }
}
