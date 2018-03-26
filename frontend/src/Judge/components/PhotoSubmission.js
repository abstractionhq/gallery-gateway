import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'

const Photo = styled.img`
  cursor: pointer;
  display: block;
  margin: 0 auto;
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
        <Photo
          src={`//localhost:3000/static/uploads/${path}`}
          onClick={() => this.openLightbox()}
        />
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
