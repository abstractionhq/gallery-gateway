import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'

import ErrorMessage from './ErrorMessage'

const Errors = ({ errors, dismiss }) => {
  return (
    <Container>
      {errors.map((error, index) => (
        <ErrorMessage
          key={index}
          message={error}
          onDismiss={() => dismiss(index)}
        />
      ))}
    </Container>
  )
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  dismiss: PropTypes.func.isRequired
}

export default Errors
