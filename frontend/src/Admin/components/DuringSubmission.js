import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'

const Entries = styled.div`
  justify-self: left;
`
const SubEntries = styled.div`
  padding-left: 1em;
`

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
    <Row>
      <Entries>
        Entries: {props.totalEntries}
        <SubEntries>
          <div>
            Photos: {props.totalPhotos}
          </div>
          <div>
            Videos: {props.totalVideos}
          </div>
          <div>
            Other: {props.totalOther}
          </div>
        </SubEntries>
      </Entries>
    </Row>
  </div>
)

DuringSubmission.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  totalEntries: PropTypes.number.isRequired,
  totalPhotos: PropTypes.number.isRequired,
  totalVideos: PropTypes.number.isRequired,
  totalOther: PropTypes.number.isRequired
}

export default DuringSubmission
