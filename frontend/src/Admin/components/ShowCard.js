import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import Moment from 'react-moment'
import BeforeSubmission from './BeforeSubmission'
import DuringSubmission from './DuringSubmission'
import DuringJudging from './DuringJudging'
import AfterShowEnd from './AfterShowEnd'
import EntrySummary from './EntrySummary'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const ShowCard = props => {
  const cardBody = (() => {
    const currentTime = moment()
    const isAfterEntryStart = currentTime.isAfter(moment(props.entryStart))
    const isBeforeEntryEnd = currentTime.isBefore(moment(props.entryEnd))
    const isAfterJudgingStart = currentTime.isAfter(moment(props.judgingStart))
    const isBeforeJudgingEnd = currentTime.isBefore(moment(props.judgingEnd))
    const isAfterJudgingEnd = currentTime.isAfter(moment(props.judgingEnd))
    const isAfterEntryEnd = currentTime.isAfter(moment(props.entryEnd))
    const isBeforeJudgingStart = currentTime.isBefore(moment(props.judgingStart))
    // Closed
    if (isAfterJudgingEnd) {
      return <AfterShowEnd entryStart={props.entryStart} judgingEnd={props.judgingEnd}/>
    }
    // Judging
    if (isAfterJudgingStart && isBeforeJudgingEnd) {
      return <DuringJudging judgingEnd={props.judgingEnd}/>
    }
    // Between Submission and Judging
    if (isAfterEntryEnd && isBeforeJudgingStart) {
      return (
        <Row>
          <Col>
            <dt>Submissions Begin:</dt>
            <dd>
              <Moment format='MMMM D, YYYY'>{props.entryStart}</Moment>
            </dd>
            <dt>Submission Closes:</dt>
            <dd>
              <Moment format='MMMM D, YYYY'>{props.entryEnd}</Moment>
            </dd>
          </Col>
          <Col>
            <dt>Judging Begins:</dt>
            <dd>
              <Moment format='MMMM D, YYYY'>{props.judgingStart}</Moment>
            </dd>
            <dt>Judging Closes:</dt>
            <dd>
              <Moment format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
            </dd>
          </Col>
        </Row>
      )
    }
    // Submission
    if (isAfterEntryStart && isBeforeEntryEnd) {
      return (
        <div>
          <DuringSubmission entryStart={props.entryStart} entryEnd={props.entryEnd}/>
          <EntrySummary
            totalEntries={props.entries.length}
            totalPhotos={props.entries.filter(entry => entry.entryType === 'PHOTO').length}
            totalVideos={props.entries.filter(entry => entry.entryType === 'VIDEO').length}
            totalOther={props.entries.filter(entry => entry.entryType === 'OTHER').length}
          />
        </div>
      )
    }
    // PreSubmission
    return (
      <BeforeSubmission
        entryStart={props.entryStart} entryEnd={props.entryEnd}
        judgingStart={props.judgingStart} judgingEnd={props.judgingEnd}
      />
    )
  })()
  return (
    <Card>
      <h2>
        <Link to={`show/${props.id}`}>{props.name}</Link>
      </h2>
      {cardBody}
      <Row>
        <Col>
          <Button
            color='primary'
            className='mr-4'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to={`/show/${props.id}`}
            block
            outline
          >
            View Details
          </Button>
          <Button
            color='primary'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to={`/show/${props.id}/submissions`}
            block
            outline
          >
            View Submissions
          </Button>
        </Col>
        <Col>
          <Button
            className='mr-4'
            color='primary'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to={`/show/${props.id}/judges`}
            block
            outline
          >
            View Progress
          </Button>
          <Button
            color='primary'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to={`/show/${props.id}/judges/assign`}
            block
            outline
          >
            Assign Judges
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      entryType: PropTypes.string.isRequired
    })
  )
}

export default ShowCard
