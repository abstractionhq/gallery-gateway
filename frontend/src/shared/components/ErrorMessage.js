import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

const ErrorMessage = props => (
  <Alert color='danger' isOpen toggle={props.onDismiss}>
    {props.message.replace(/GraphQL error: /,'')}
  </Alert>
)

ErrorMessage.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
}

export default ErrorMessage
