import React, { Fragment } from 'react'
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

const ShowJudgesTab = ({ voteCountByJudge, numEntries, show }) => (
  <Fragment>
    <Row style={{ marginBottom: '1.5rem' }}>
      <Col className='text-right'>
        <Link to={`/show/${show.id}/judges/assign`}>
          <Button color='primary'>Assign Judges</Button>
        </Link>
      </Col>
    </Row>
    {show.judges.length > 0 ? (
      show.judges.map(judge => {
        const numVotes = voteCountByJudge[judge.username] || 0
        return (
          <Row key={judge.username} style={{ marginBottom: '1.5rem' }}>
            <Col md='3'>
              {judge.firstName} {judge.lastName} ({judge.username})
            </Col>
            <Col>
              {numVotes ? (
                <Progress
                  value={numVotes / numEntries * 100}
                  color={colorForProgress(numVotes / numEntries)}
                >
                  {numVotes} / {numEntries}
                </Progress>
              ) : (
                <div className='text-center text-muted'>
                  No submissions have been judged.
                </div>
              )}
            </Col>
          </Row>
        )
      })
    ) : (
      <div className='text-center'>
        No judges are assigned to this show. Visit the{' '}
        <Link to={`/show/${show.id}/judges/assign`}>"Assign Judges"</Link> page
        to assign judges to this show.
      </div>
    )}
  </Fragment>
)

ShowJudgesTab.propTypes = {
  voteCountByJudge: PropTypes.object.isRequired,
  numEntries: PropTypes.number.isRequired,
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    judges: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      })
    ).isRequired
  })
}

export default ShowJudgesTab
