export default {
  User: {
    // Judges (and Admins) have shows
    shows (user) {
      return user.getShows({order: [['judgingStart', 'DESC']]})
    }
  }
}
