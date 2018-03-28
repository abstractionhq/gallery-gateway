import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import VideoSubmission from '../components/VideoSubmission'
import PhotoSubmission from '../components/PhotoSubmission'
import OtherMediaSubmission from '../components/OtherMediaSubmission'

// Submission types
const VIDEO = 'VIDEO'
const PHOTO = 'PHOTO'
const OTHER = 'OTHER'

const Title = styled.h5`
  color: white;
  text-align: center;
`

const Submission = props => (
  <Fragment>
    <Title>{props.submission.title}</Title>
    {props.submission.entryType === VIDEO ? (
      <VideoSubmission
        provider={props.submission.provider}
        videoId={props.submission.videoId}
      />
    ) : props.submission.entryType === PHOTO ? (
      <PhotoSubmission path={props.submission.path} />
    ) : props.submission.entryType === OTHER ? (
      <OtherMediaSubmission path={props.submission.path} />
    ) : null}
  </Fragment>
)

Submission.propTypes = {
  submission: PropTypes.shape({
    entryType: PropTypes.string.isRequired,
    title: PropTypes.string,
    provider: PropTypes.string,
    videoId: PropTypes.string,
    path: PropTypes.string
  })
}

export default Submission
