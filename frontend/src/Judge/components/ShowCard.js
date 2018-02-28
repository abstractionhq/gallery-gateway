import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Button, Row, Col } from 'reactstrap'
import moment from 'moment'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`
const ButtonContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`

function renderCardContents (props) {
  const now = moment()
  const judgingStart = moment(props.judgingStart)
  if (now.isBefore(judgingStart)) {
    return renderBeforeJudging(props)
  } else {
    return renderDuringJudging(props)
  }
}
function renderDuringJudging (props) {
  return (
    <div>
      <Col>
        <dl>
          <dt>Judging Ends:</dt>
          <dd>
            <Moment format='YYYY/MM/DD'>{props.judgingEnd}</Moment>
          </dd>
        </dl>
      </Col>
      <Col>
        <ButtonContainer>
          <Button
            size='lg'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to={`show/${props.id}/vote`}
            // TODO: Conditionally change the text
          >
            Start
          </Button>
        </ButtonContainer>
      </Col>
    </div>
  )
}

function renderBeforeJudging (props) {
  return (
    <Col>
      <div> Judging has not started yet. Come back to vote soon! </div>
      <dl>
        <dt>Judging Starts:</dt>
        <dd>
          <Moment format='YYYY/MM/DD'>{props.judgingStart}</Moment>
        </dd>
        <dt>Judging Ends:</dt>
        <dd>
          <Moment format='YYYY/MM/DD'>{props.judgingEnd}</Moment>
        </dd>
      </dl>
    </Col>
  )
}

const ShowCard = props => (
  <Card>
    <h2>
      <Link to={`show/${props.id}`}>{props.name}</Link>
    </h2>
    {renderCardContents(props)}
  </Card>
)

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
