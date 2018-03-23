import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Video Providers
const YOUTUBE_BASE_URL = 'https://www.youtube.com/embed/'
const YOUTUBE_VIDEO_CONTROLS = '?autoplay=1&controls=0'
const VIMEO_BASE_URL = 'https://player.vimeo.com/video/'
const VIMEO_VIDEO_CONTROLS = '?autoplay=1'
const PlayerContainer = styled.div`
  height: 100%;
  display: inline-block;
  flex-grow: 1
  display: flex
  flex-direction: column
`

class VideoSubmission extends Component {
  static propTypes = {
    provider: PropTypes.string.isRequired,
    videoId: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      height: 0,
      width: 0
    }
  }

  updateDimensions = () => {
    const videoPlayerContainer = document.getElementById('videoPlayerContainer')
    const height = videoPlayerContainer.clientHeight // height is static to container max size
    const width = height * 1.7778 // width is 640/360 (default width and height)
    this.setState({
      height: height,
      width: width
    })
  }

  componentDidMount () {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions)
  }

  render () {
    const { provider, videoId } = this.props
    return (
      <PlayerContainer id='videoPlayerContainer'>
        {provider === 'youtube' ? (
          <iframe 
          frameBorder="0" 
          allowFullScreen="1" 
          width="100%" 
          height="100%"
          src={`${YOUTUBE_BASE_URL}${videoId}${YOUTUBE_VIDEO_CONTROLS}`}
          style={{flexGrow: '1'}}/>
        ) : provider === 'vimeo' ? (
          <iframe 
          frameBorder="0" 
          allowFullScreen="1" 
          width="100%" 
          height="100%"
          src={`${VIMEO_BASE_URL}${videoId}${VIMEO_VIDEO_CONTROLS}`}
          style={{flexGrow: '1'}}/>
        ) : null}
      </PlayerContainer>
    )
  }
}
export default VideoSubmission
