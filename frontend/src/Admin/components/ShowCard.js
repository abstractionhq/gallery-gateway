import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'
import { Button, Row, Col } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const ShowCard = props => (
  <Card>
    <h2>
      <Link to={`show/${props.id}`}>{props.name}</Link>
    </h2>
    <Row>
      <Col>
        <h4>Submission Period</h4>
        <dl>
          <dt>Opens:</dt>
          <dd>
            <Moment title={moment(props.entryStart).format('MMMM D, YYYY hh:mm:ss a')} format='MMMM D, YYYY'>{props.entryStart}</Moment>
          </dd>
          <dt>Closes:</dt>
          <dd>
            <Moment title={moment(props.entryEnd).format('MMMM D, YYYY hh:mm:ss a')} format='MMMM D, YYYY'>{props.entryEnd}</Moment>
          </dd>
        </dl>
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
        <h4>Judging Period</h4>
        <dl>
          <dt>Opens:</dt>
          <dd>
            <Moment title={moment(props.judgingStart).format('MMMM D, YYYY hh:mm:ss a')} format='MMMM D, YYYY'>{props.judgingStart}</Moment>
          </dd>
          <dt>Closes:</dt>
          <dd>
            <Moment title={moment(props.judgingEnd).format('MMMM D, YYYY hh:mm:ss a')} format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
          </dd>
        </dl>
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

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
