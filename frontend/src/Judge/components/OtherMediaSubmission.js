import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import { Alert } from 'reactstrap'

import pdf from 'assets/pdf.svg'
import PhotoSubmission from '../components/PhotoSubmission'

const PdfImg = styled.div`
  max-height: 400px;
  min-height: 2em;
  height: 300px;
  background-repeat: no-repeat
  background-position: center
  background-size: contain 
`
const PdfWell = styled.a`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: black;
  min-height: 5em;
  background-color: #666666;
  box-shadow: inset 2px 2px 1px rgba(0, 0, 0, 0.05);
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
          style={{ textAlign: 'center' }}
        >
          This submission may need to be viewed in person
        </Alert>
        {path.match('.pdf$') ? (
          // TODO make this URL responsive to deploy environment
          <PdfWell href={`//localhost:3000/static/uploads/${path}`} target='_blank'>
            <PdfImg style={{backgroundImage: `url(${pdf})`}}  />
            <h3>Click to View</h3>
          </PdfWell>
        ) : (<PhotoSubmission path={path} />)}
      </Fragment>
    )
  }
}

export default OtherMediaSubmission
