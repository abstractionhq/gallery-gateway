import { ADMIN, JUDGE, STUDENT } from '../../constants'
import Show from '../../models/show'

export default {
  User: {
    // Judges (and Admins) are assigned to shows, Students are not
    shows (user, args) {
      let getShows
      switch (user.type) {
        case STUDENT:
          return []
        case ADMIN:
          // Admins query against all shows
          getShows = Show.findAll.bind(Show)
          break
        case JUDGE:
          // Judges only query against their assigned shows
          getShows = user.getShows.bind(user)
          break
      }
      // Check if given date is before any show ends
      if (args.date) {
        return getShows({
          where: {
            judgingEnd: {gte: args.date}
          },
          order: [['judgingStart', 'DESC']]
        })
      }
      // For no args just find all shows this user is assigned to
      return getShows({order: [['judgingStart', 'DESC']]})
    }
  }
}
