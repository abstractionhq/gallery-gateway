import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Video Providers
const YOUTUBE_BASE_URL = 'https://www.youtube.com/embed/'
const YOUTUBE_VIDEO_CONTROLS = '?autoplay=1&controls=0'
const VIMEO_BASE_URL = 'https://player.vimeo.com/video/'
const VIMEO_VIDEO_CONTROLS = '?autoplay=1'

const PlayerContainer = styled.div`
  margin: 0 auto 25px;
  max-width: 75%;
`

class VideoSubmission extends Component {
  static propTypes = {
    provider: PropTypes.string.isRequired,
    videoId: PropTypes.string.isRequired
  }

  render () {
    const { provider, videoId } = this.props

    return (
      <PlayerContainer className='embed-responsive embed-responsive-16by9'>
        {provider === 'youtube' ? (
          <iframe
            title='youtube-player'
            allowFullScreen='1'
            src={`${YOUTUBE_BASE_URL}${videoId}${YOUTUBE_VIDEO_CONTROLS}`}
            className='embed-responsive-item'
          />
        ) : provider === 'vimeo' ? (
          <iframe
            title='vimeo-player'
            allowFullScreen='1'
            src={`${VIMEO_BASE_URL}${videoId}${VIMEO_VIDEO_CONTROLS}`}
            className='embed-responsive-item'
          />
        ) : null}
      </PlayerContainer>
    )
  }
}
export default VideoSubmission
