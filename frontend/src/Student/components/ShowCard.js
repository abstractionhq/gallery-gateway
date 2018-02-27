import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FaPlusCircle from 'react-icons/lib/fa/plus-circle'
import { Row, Col } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const ShowCard = (props) => (
  <Card>
    <Row>
      <Col style={{ display: 'flex' }}>
        <h2 style={{ alignSelf: 'flex-end', margin: 0 }}>{props.show.name}</h2>
      </Col>
      <Col className='text-right'>
        <div>
          <h5>{props.show.entries.length}/{props.show.entryCap} Submissions</h5>
        </div>
        <div>
          Accepting Submissions Until: <Moment format='MMMM Do YYYY'>{props.show.entryEnd}</Moment>
        </div>
      </Col>
    </Row>
    <hr />
    <Row style={{ minHeight: '250px' }}>
      <Col className='text-center align-self-center justify-content-center h-100'>
        <Link to={`/submit?to=${props.show.id}`} className='d-block w-100 h-100'>
          <FaPlusCircle size='3em' />
          <h5 className='mt-1'>New Submission</h5>
        </Link>
      </Col>
    </Row>
  </Card>
)

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    entryCap: PropTypes.number,
    entries: PropTypes.array,
    entryStart: PropTypes.string,
    entryEnd: PropTypes.string,
    judgingStart: PropTypes.string,
    judgingEnd: PropTypes.string
  }).isRequired
}

ShowCard.defaultProps = {
  show: {
    entries: []
  }
}

export default ShowCard
