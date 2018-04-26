import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'

const DuringSubmission = props => (
  <div>
    <Row>
      <h5> Submitting </h5>
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
    </Row>
  </div>
)

DuringSubmission.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired
}

export default DuringSubmission
