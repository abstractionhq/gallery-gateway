import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'

const DuringJudging = props => (
  <div>
    <Row>
      <h5> Judging </h5>
    </Row>
    <Row>
      <Col>
        <h4>Judging Period</h4>
        <dl>
          <dt>Opens:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.judgingStart}</Moment>
          </dd>
          <dt>Closes:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
          </dd>
        </dl>
      </Col>
    </Row>
  </div>
)

DuringJudging.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default DuringJudging
