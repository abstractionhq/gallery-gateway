import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle'

class ErrorHandler extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  componentDidCatch (error, info) {
    this.setState({
      hasError: true
    })
    console.error(error, info)
  }

  render () {
    // If there's an error, display the error page
    if (this.state.hasError) {
      return (
        <Container>
          <Row>
            <Col
              className='text-center'
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon icon={FaExclamationCircle} size='3x' />
              <h1>Something went wrong.</h1>
              <p style={{ maxWidth: '50%' }}>
                Please clear your browser cache and cookies and then refresh the
                page.<br />If the issue persists, please contact a site
                administrator.
              </p>
            </Col>
          </Row>
        </Container>
      )
    }

    // Normally render the children
    return this.props.children
  }
}

export default ErrorHandler
