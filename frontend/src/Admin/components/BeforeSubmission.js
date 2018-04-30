import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const BeforeSubmission = props => (
  <div>
    <h4> Pre Show </h4>
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
  </div>
)

BeforeSubmission.propTypes = {
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default BeforeSubmission
