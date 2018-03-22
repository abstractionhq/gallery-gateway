import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import styled from 'styled-components'

// Video Providers
const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v='
const VIMEO_BASE_URL = 'https://vimeo.com/'

const PlayerContainer = styled.div`
  height: 100%;
  display: inline-block;
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
          <ReactPlayer
            url={`${YOUTUBE_BASE_URL}${videoId}`}
            playing
            controls
            width={this.state.width}
            height={this.state.height}
          />
        ) : provider === 'vimeo' ? (
          <ReactPlayer
            url={`${VIMEO_BASE_URL}${videoId}`}
            playing
            controls
            width={this.state.width}
            height={this.state.height}
          />
        ) : null}
      </PlayerContainer>
    )
  }
}
export default VideoSubmission
