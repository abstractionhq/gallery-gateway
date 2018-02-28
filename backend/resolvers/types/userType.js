export default {
  User: {
    // Judges (and Admins) have shows
    shows (user, args) {
      // Check if given date is in a show range
      if (args.date) {
        return user.getShows({
          where: {
            entryStart: {lte: args.date},
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
