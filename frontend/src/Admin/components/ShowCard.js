import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Button, ButtonGroup, Row, Col } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const ShowCard = (props) => (
  <Card>
    <h2><Link to={`show/${props.id}`}>{props.name}</Link></h2>
    <Row>
      <Col>
        <dl>
          <dt>Submission Starts:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.entryStart}</Moment></dd>
          <dt>Submission Ends:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.entryEnd}</Moment></dd>
        </dl>
      </Col>
      <Col>
        <dl>
          <dt>Judging Starts:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.judgingStart}</Moment></dd>
          <dt>Judging Ends:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.judgingEnd}</Moment></dd>
        </dl>
      </Col>
    </Row>
    <Row>
      <Col>
        <ButtonGroup>
          <Button style={{cursor: 'pointer'}} tag={Link} to={`show/${props.id}/submissions`}>View Submissions</Button>{' '}
          <Button style={{cursor: 'pointer'}} tag={Link} to={`show/${props.id}/judges`}>Manage Judges</Button>
        </ButtonGroup>
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
