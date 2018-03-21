import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'


const PhotoContainer = styled.img`
width: auto;
height: 100%;
text-align:center;
`

const PhotoSubmission = props =>
  <PhotoContainer
    // TODO make this URL responsive to deploy environment
    src={`//localhost:3000/static/uploads/${props.path}`}
  >
  </PhotoContainer>

PhotoSubmission.propTypes = {
  path: PropTypes.string.isRequired
}

export default PhotoSubmission
