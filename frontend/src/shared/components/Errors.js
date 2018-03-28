import React from 'react'
import PropTypes from 'prop-types'

import ErrorMessage from './ErrorMessage'

const Errors = ({ errors, dismiss }) => errors.map((error, index) => <ErrorMessage key={index} message={error} onDismiss={() => dismiss(index)} />)

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  dismiss: PropTypes.func.isRequired
}

export default Errors
