import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'

const PhotoContainer = styled.div`
  flex-grow: 1
  background-repeat: no-repeat
  background-position: center
  background-size: contain
`

class PhotoSubmission extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isLightboxOpen: false
    }
  }

  closeLightbox = () => {
    this.setState({ isLightboxOpen: false })
  }

  openLightbox = () => {
    this.setState({ isLightboxOpen: true })
  }

  render () {
    const { path } = this.props

    return (
      <Fragment>
        <PhotoContainer 
        style={{backgroundImage: `url(//localhost:3000/static/uploads/${path})`}} 
        onClick={() => this.openLightbox()}/>
        <Lightbox
          images={[{ src: `//localhost:3000/static/uploads/${path}` }]}
          isOpen={this.state.isLightboxOpen}
          onClose={() => this.closeLightbox()}
          showImageCount={false}
          backdropClosesModal={true}
          onClickImage={() => this.closeLightbox()}
          showCloseButton={false}
        />
      </Fragment>
    )
  }
}

export default PhotoSubmission
