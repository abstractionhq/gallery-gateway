import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'

const BeforeSubmission = props => (
  <div>
    <Row>
      <h5> Pre Show </h5>
    </Row>
    <Row>
      <Col>
        <h4>Submission Period</h4>
        <dl>
          <dt>Opens:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.entryStart}</Moment>
          </dd>
          <dt>Closes:</dt>
          <dd>
            <Moment format='MMMM D, YYYY'>{props.entryEnd}</Moment>
          </dd>
        </dl>
      </Col>
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

BeforeSubmission.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default BeforeSubmission
