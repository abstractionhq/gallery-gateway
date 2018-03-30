import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Progress, Button } from 'reactstrap'
import { Link } from 'react-router-dom'

// Calculates a Bootstrap color for the given fractional progress, given
// as a number from 0 to 1.
const colorForProgress = progress => {
  if (progress < 0.1) {
    return 'danger'
  }
  if (progress < 0.25) {
    return 'warning'
  }
  if (progress < 1) {
    return null // default color
  }
  return 'success'
}

const ShowJudgesTab = ({ show }) => {
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

  return (
    <div>
      <Row style={{ marginBottom: '1.5rem' }}>
        <Col className='text-right'>
          <Link to={`/show/${show.id}/judges/assign`}>
            <Button color='primary'>Manage Judges</Button>
          </Link>
        </Col>
      </Row>
      {show.judges.map(judge => {
        const numVotes = voteCountByJudge[judge.username] || 0
        return (
          <Row key={judge.username} style={{ marginBottom: '1.5rem' }}>
            <Col md='3'>
              {judge.firstName} {judge.lastName} ({judge.username})
            </Col>
            <Col>
              <Progress
                value={numVotes / numEntries * 100}
                color={colorForProgress(numVotes / numEntries)}
              >
                {numVotes} / {numEntries}
              </Progress>
            </Col>
          </Row>
        )
      })}
    </div>
  )
}

ShowJudgesTab.propTypes = {
  show: PropTypes.shape({
    judges: PropTypes.arrayOf({
      username: PropTypes.string.isRequired
    }).isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        votes: PropTypes.arrayOf(
          PropTypes.shape({
            judge: PropTypes.shape({
              username: PropTypes.string.isRequired
            }).isRequired
          })
        ).isRequired
      })
    ).isRequired
  }).isRequired
}

export default ShowJudgesTab
