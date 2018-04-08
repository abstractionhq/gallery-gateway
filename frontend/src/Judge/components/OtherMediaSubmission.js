import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

import pdf from 'assets/pdf.svg'
import PhotoSubmission from '../components/PhotoSubmission'
import { STATIC_PATH } from '../../utils'

const PdfImg = styled.div`
  background-image: url(${pdf});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 300px;
  max-height: 400px;
  min-height: 2em;
`

const PdfWell = styled.a`
  background-color: #666666;
  box-shadow: inset 2px 2px 1px rgba(0, 0, 0, 0.05);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 25px;
  text-align: center;

  &:hover {
    color: white;
  }

  h4 {
    color: white;
    margin: 10px 0 0;
  }
`

class OtherMediaSubmission extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      alertVisible: true
    }
  }

  onDismiss = () => {
    this.setState({
      alertVisible: false
    })
  }

  render () {
    const { path } = this.props

    return (
      <Fragment>
        <Alert
          color='warning'
          isOpen={this.state.alertVisible}
          toggle={() => this.onDismiss()}
          className='text-center'
        >
          This submission may need to be viewed in person
        </Alert>
        {path.match('.pdf$') ? (
          <PdfWell href={`${STATIC_PATH}${path}`} target='_blank'>
            <PdfImg />
            <h4>Click to View</h4>
          </PdfWell>
        ) : (
          <PhotoSubmission path={path} />
        )}
      </Fragment>
    )
  }
}

export default OtherMediaSubmission
