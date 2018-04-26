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

const ShowCardCopy = props => {
  const cardBody = (() => {
    const currentTime = moment(Date.now())
    // Closed
    if (currentTime > moment(props.judgingEnd)) {
      return <AfterShowEnd start={props.entryStart} end={props.judgingEnd}/>
    }
    // Judging
    if (currentTime > moment(props.judgingStart)) {
      return <DuringJudging judgingEnd={props.judgingEnd}/>
    }
    // Between Submission and Judging
    if (currentTime > moment(props.entryEnd)) {
      return (
        <dl>
          <dt>Submissions Begin:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.entryStart}</Moment>
          </dd>
          <dt>Submission Closes:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.entryEnd}</Moment>
          </dd>
          <dt>Judging Begins:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.judgingStart}</Moment>
          </dd>
          <dt>Judging Closes:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
          </dd>
        </dl>
      )
    }
    // Submission
    if (currentTime > moment(props.entryStart)) {
      console.log(props.submission)
      return (
        <div>
          <DuringSubmission submissionStart={props.entryStart} submissionEnd={props.entryEnd}/>
          <EntrySummary
            totalEntries={10}
            totalPhotos={5}
            totalVideos={2}
            totalOther={3}
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
    // <Card>
    //   <Title>
    //     <h2><Link to={`show/${props.id}`}>{props.name}</Link></h2>
    //   </Title>
    //   {cardBody}
    //   <ViewMore>
    //     <Button color='info' style={{cursor: 'pointer'}} tag={Link} to={`show/${props.id}`}>View More</Button>
    //   </ViewMore>
    // </Card>
    <Card>
      <h2>
        <Link to={`show/${props.id}`}>{props.name}</Link>
      </h2>
      <Row>
        {cardBody}
      </Row>
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

ShowCardCopy.propTypes = {
  submission: PropTypes.shape({
    entryType: PropTypes.string.isRequired
  }),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCardCopy
