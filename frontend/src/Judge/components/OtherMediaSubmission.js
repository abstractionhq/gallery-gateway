import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import { Alert } from 'reactstrap'

import pdf from 'assets/pdf.svg'
import PhotoSubmission from '../components/PhotoSubmission'

const PdfImg = styled.img` 
  height: 150px;
  width: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -90px 0 0 -90px;
  display: block;
`
const PdfWell = styled.div`
  position: relative
  height: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;  
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
  display: block;
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
              <PdfWell>
                <PdfImg src={pdf} />
                <PdfText>
                  <h3>Click to View</h3>
                </PdfText>
              </PdfWell>
            </a>
          </div>
        ) : (<PhotoSubmission path={path} />)}
      </Fragment>
    )
  }
}

export default OtherMediaSubmission
