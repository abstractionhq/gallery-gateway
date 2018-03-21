import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images';


const PhotoContainer = styled.img`
  height:100%;
  object-fit:scale-down;
  width:100%;
`

class PhotoSubmission extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      lightboxIsOpen: false,
    }
  }

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false })
  }

  openLightbox = () => {
    this.setState({ lightboxIsOpen: true })
  }


  render() {
    const {
      path
    } = this.props

    return (
      <Fragment>
        <PhotoContainer
          // TODO make this URL responsive to deploy environment
          src={`//localhost:3000/static/uploads/${path}`}
          onClick={() => this.openLightbox()}
        >
        </PhotoContainer>
        <Lightbox
          images={[{ src: `//localhost:3000/static/uploads/${path}` }]}
          isOpen={this.state.lightboxIsOpen}
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
