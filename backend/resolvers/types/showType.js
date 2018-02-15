export default {
  Show: {
    judges (show) {
      return show.getUsers()
    },
    entries (show) {
      return show.getEntries()
    }
  }
}
