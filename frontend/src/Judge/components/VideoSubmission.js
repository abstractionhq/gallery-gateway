import React from 'react'
import ReactPlayer from 'react-player'
import styled from 'styled-components'

// Video Providers
const youtubeBaseURL = 'https://www.youtube.com/watch?v='
const vimeoBaseURL = 'https://vimeo.com/'

const videoStyle = {
  minHeight: '500px',
}

const VideoSubmission = props => (
  <div>
    {props.provider === 'youtube' ? (
      <ReactPlayer url={youtubeBaseURL + props.videoId} playing controls width='100%' style={videoStyle}/>
    ) : props.provider === 'vimeo' ? (
      <ReactPlayer url={vimeoBaseURL + props.videoId} playing controls width='100%' style={videoStyle} />
    ) : null}
  </div>
)

export default VideoSubmission
