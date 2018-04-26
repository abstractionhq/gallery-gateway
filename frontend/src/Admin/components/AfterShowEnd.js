import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'

const AfterShowEnd = props => (
  <div>
    <Row>
      <h5> Closed Show </h5>
    </Row>
    <Row>
      <Col>
        <Moment format='MMMM D, YYYY'>{props.entryStart}</Moment>
        -
        <Moment format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
      </Col>
    </Row>
  </div>
)

AfterShowEnd.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default AfterShowEnd
