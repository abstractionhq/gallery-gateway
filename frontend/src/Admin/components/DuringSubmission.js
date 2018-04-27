import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const DuringSubmission = props => (
  <div>
    <h5> Submitting </h5>
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
  </div>
)

DuringSubmission.propTypes = {
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired
}

export default DuringSubmission
