export default {
  User: {
    // Judges (and Admins) are assigned to shows, Students are not
    shows (user, args) {
      if (user.type === 'STUDENT') {
        return []
      }
      // Check if given date is before any show ends
      if (args.date) {
        return user.getShows({
          where: {
            judgingEnd: {gte: args.date}
          },
          order: [['judgingStart', 'DESC']]
        })
      }
      // For no args just find all shows this user is assigned to
      return user.getShows({order: [['judgingStart', 'DESC']]})
    }
  }
}
