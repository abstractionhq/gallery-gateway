export default {
  Vote: {
    judge (vote) {
      return vote.getJudge()
    },
    entry (vote) {
      return vote.getEntry()
    }
  }
}
