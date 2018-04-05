import React from 'react'
import ShowJudgesTab from '../components/ShowJudgesTab'

export default function ({ show }) {
  // Extract all votes we care about
  const allVotes = show.entries.reduce(
    // Don't count votes on entries that are excluded
    (lst, entry) => (entry.excludeFromJudging ? lst : [...lst, ...entry.votes]),
    []
  )

  // Count the votes by judge
  const voteCountByJudge = allVotes.reduce(
    (accum, vote) => ({
      ...accum,
      [vote.judge.username]: (accum[vote.judge.username] || 0) + 1
    }),
    {}
  )

  // Count the number of total entries that are in judging
  const numEntries = show.entries.filter(entry => !entry.excludeFromJudging)
    .length

  const showSortedJudges = {
    ...show,
    judges: show.judges.slice().sort(({ username: u1 }, { username: u2 }) => {
      if (u1 < u2) {
        return -1
      }
      if (u2 > u1) {
        return 1
      }
      return 0
    })
  }

  return (
    <ShowJudgesTab
      voteCountByJudge={voteCountByJudge}
      numEntries={numEntries}
      show={showSortedJudges}
    />
  )
}
