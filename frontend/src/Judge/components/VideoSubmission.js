import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import styled from 'styled-components'

// Video Providers
const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v='
const VIMEO_BASE_URL = 'https://vimeo.com/'

const PlayerContainer = styled.div`
  /* Center the top-most 'div' that ReactPlayer wraps around the 'iframe'  */
  & > div {
    margin: 0 auto;
  }
`

const VideoSubmission = props => (
  <PlayerContainer>
    {props.provider === 'youtube' ? (
      <ReactPlayer url={`${YOUTUBE_BASE_URL}${props.videoId}`} playing controls />
    ) : props.provider === 'vimeo' ? (
      <ReactPlayer url={`${VIMEO_BASE_URL}${props.videoId}`} playing controls />
    ) : null}
  </PlayerContainer>
)

VideoSubmission.propTypes = {
  provider: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired
}

export default VideoSubmission