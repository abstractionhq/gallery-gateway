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

const DuringJudging = ({ ownVotes, entries, judgingEnd, id }) => (
  <div>
    <Col>
      <dl>
        <dt>Judging Progress:</dt>
        <dd>
          {ownVotes.length} / {entries.length}
        </dd>
        <dt>Judging Ends:</dt>
        <dd>
          <Moment format='YYYY/MM/DD'>{judgingEnd}</Moment>
        </dd>
      </dl>
    </Col>
    <Col>
      <ButtonContainer>
        <Button
          size='lg'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`show/${id}/vote`}
        >
          {ownVotes.length === 0
            ? 'Start'
            : ownVotes.length === entries.length ? 'Review' : 'Resume'}
        </Button>
      </ButtonContainer>
    </Col>
  </div>
)

const BeforeJudging = ({ judgingStart, judgingEnd }) => (
  <div>
    <Col>
      <div> Judging has not started yet. Come back to vote soon! </div>
      <dl>
        <dt>Judging Starts:</dt>
        <dd>
          <Moment format='YYYY/MM/DD'>{judgingStart}</Moment>
        </dd>
        <dt>Judging Ends:</dt>
        <dd>
          <Moment format='YYYY/MM/DD'>{judgingEnd}</Moment>
        </dd>
      </dl>
    </Col>
  </div>
)

const ShowCard = props => (
  <Card>
    <h2>
      <Link to={`show/${props.id}`}>{props.name}</Link>
    </h2>
    {moment().isBefore(moment(props.judgingStart)) ? (
      <BeforeJudging {...props} />
    ) : (
      <DuringJudging {...props} />
    )}
  </Card>
)

ShowCard.defaultProps = {
  entries: [],
  ownVotes: []
}

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ),
  ownVotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  )
}

export default ShowCard
