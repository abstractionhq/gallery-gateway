import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const AfterShowEnd = props => (
  <div>
    <h5> Closed Show </h5>
    <Moment format='MMMM D, YYYY'>{props.entryStart}</Moment>
    -
    <Moment format='MMMM D, YYYY'>{props.judgingEnd}</Moment>
  </div>
)

AfterShowEnd.propTypes = {
  entryStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default AfterShowEnd
