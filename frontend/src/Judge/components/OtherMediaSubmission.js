import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import { Alert } from 'reactstrap'

import pdf from 'assets/pdf.svg'

const PhotoContainer = styled.img`
  height: 90%;
  object-fit: scale-down;
  width: 100%;
`

const PdfContainer = styled.img`
  height: 100%;
  object-fit: scale-down;
  width: 45%;
  background-color: #666666;
  box-shadow: inset 2px 2px 1px rgba(0, 0, 0, 0.05);
`

const PdfText = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
`

class OtherMediaSubmission extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      lightboxIsOpen: false
    }
  }

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false })
  }

  openLightbox = () => {
    this.setState({ lightboxIsOpen: true })
  }

  render () {
    const { path } = this.props

    return (
      <Fragment>
        {path.endsWith('.pdf') ? (
          <div style={{ height: '80%', marginTop: '25px' }}>
            <a href={`//localhost:3000/static/uploads/${path}`} target='_blank'>
              <PdfContainer src={pdf} />
              <PdfText>
                <h3>Click to View</h3>
              </PdfText>
            </a>
            <Alert
              color='info'
              style={{
                marginTop: '45px',
                width: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              This submission may need to be viewed in person
            </Alert>
          </div>
        ) : (
          <Fragment>
            <PhotoContainer
              // TODO make this URL responsive to deploy environment
              src={`//localhost:3000/static/uploads/${path}`}
              onClick={() => this.openLightbox()}
            />
            <Alert
              color='info'
              style={{
                marginTop: '45px',
                width: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              This submission may need to be viewed in person
            </Alert>
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
        )}
      </Fragment>
    )
  }
}

export default OtherMediaSubmission
