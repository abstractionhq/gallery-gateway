import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FaPlusCircle from 'babel-loader!react-icons/fa/plus-circle'
import { Row, Col } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`
const ShowTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-self: baesline;
`

const ShowCard = (props) => (
  <Card>
    <Row>
      <ShowTitle>
        <Col>
          <h2>{props.name}</h2>
        </Col>
      </ShowTitle>
      <Col className="text-right">
        <div>
          <h5>{props.entries.length}/{props.entryCap} submissions</h5>
        </div>
        <div>
          Accepting Submissions until: <Moment format='MMMM Do YYYY'>{props.entryEnd}</Moment>
        </div>
      </Col>
    </Row>
    <hr />
    <Row style={{minHeight: '250px'}}>
      <Col className='text-center align-self-center justify-content-center h-100'>
        <Link to={`/submit?to=${props.id}`} className='d-block w-100 h-100'>
          <FaPlusCircle size='3em' />
          <h5>New Submission</h5>
        </Link>
      </Col>
    </Row>
  </Card>
)

ShowCard.defaultProps = {
  entries: []
}

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryCap: PropTypes.number.isRequired,
  entries: PropTypes.array.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
