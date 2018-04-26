import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Entries = styled.div`
  justify-self: left;
`
const SubEntries = styled.div`
  padding-left: 1em;
`

const EntrySummary = (props) => (
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
)

EntrySummary.propTypes = {
  totalEntries: PropTypes.number.isRequired,
  totalPhotos: PropTypes.number.isRequired,
  totalVideos: PropTypes.number.isRequired,
  totalOther: PropTypes.number.isRequired
}

export default EntrySummary
