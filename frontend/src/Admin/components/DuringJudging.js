import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const DuringJudging = props => (
  <div>
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

DuringJudging.propTypes = {
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default DuringJudging
