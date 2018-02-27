import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Button, Row, Col } from 'reactstrap'

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
  width: '150px';
`

const ShowCard = props => (
  <Card>
    <h2>
      <Link to={`show/${props.id}`}>{props.name}</Link>
    </h2>
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
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`show/${props.id}/vote`}
          // TODO: Conditionally change the text
        >
          Start
        </Button>
      </ButtonContainer>
    </Col>
  </Card>
)

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
