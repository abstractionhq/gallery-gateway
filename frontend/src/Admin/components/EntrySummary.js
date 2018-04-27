import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Entries = styled.div`
  justify-self: left;
`
const SubEntries = styled.div`
  padding-left: 1em;
`

const BoldHeader = styled.span`
  font-weight: bold;
`

const EntrySummary = (props) => (
  <Entries>
    <BoldHeader>Entries:</BoldHeader> {props.totalEntries}
    <SubEntries>
      <div>
        <BoldHeader>Photos:</BoldHeader> {props.totalPhotos}
      </div>
      <div>
        <BoldHeader>Videos:</BoldHeader> {props.totalVideos}
      </div>
      <div>
        <BoldHeader>Other:</BoldHeader> {props.totalOther}
      </div>
    </SubEntries>
  </Entries>
)

EntrySummary.propTypes = {
  totalEntries: PropTypes.number.isRequired,
  totalPhotos: PropTypes.number.isRequired,
  totalVideos: PropTypes.number.isRequired,
  totalOther: PropTypes.number.isRequired
}

export default EntrySummary
