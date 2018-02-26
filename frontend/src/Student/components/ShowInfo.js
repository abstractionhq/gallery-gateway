import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const Submissions = styled.div`
  justify-self: left;
`

const SubmissionInfo = (props) => (
  <Submissions>
    <div>
      <h5>2/3 Submissions</h5>
    </div>
    <div>
      Submission Ends: <Moment format='YYYY/MM/DD'>{props.entryEnd}</Moment>
    </div>
  </Submissions>
)

SubmissionInfo.propTypes = {
  entryEnd: PropTypes.string.isRequired,
}

export default SubmissionInfo
