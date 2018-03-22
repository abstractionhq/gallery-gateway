import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import { Alert } from 'reactstrap'

import pdf from 'assets/pdf.svg'
import PhotoSubmission from '../components/PhotoSubmission'

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
  render() {
    const { path } = this.props

    return (
      <Fragment>
        <Alert
          color='warning'
        >
          This submission may need to be viewed in person
        </Alert>
        {path.match('.pdf$') ? (
          <div style={{ height: '80%', marginTop: '25px' }}>
            { /* TODO make this URL responsive to deploy environment */}
            <a href={`//localhost:3000/static/uploads/${path}`} target='_blank'>
              <PdfContainer src={pdf} />
              <PdfText>
                <h3>Click to View</h3>
              </PdfText>
            </a>
          </div>
        ) : ( <PhotoSubmission path={path}/>)}
      </Fragment>
    )
  }
}

export default OtherMediaSubmission
