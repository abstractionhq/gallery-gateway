import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Creatable } from 'react-select'

import 'react-select/dist/react-select.css'

// See: https://github.com/jaredpalmer/formik#why-use-setfieldvalue-instead-of-handlechange
class FormikSelectInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    input: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.shape({
          value: PropTypes.string,
          label: PropTypes.string
        }),
        PropTypes.arrayOf( // If 'multi' select
          PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
          }))
      ]),
      onChange: PropTypes.func, // setFieldValue
      onBlur: PropTypes.func // setFieldTouched
    }).isRequired,
    options: PropTypes.array.isRequired
  }

  handleChange = (value) => {
    this.props.input.onChange(this.props.field, value)
  }

  handleBlur = () => {
    this.props.input.onBlur(this.props.field, true)
  }

  render () {
    return (
      <Creatable
        {...this.props}
        options={this.props.options}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        value={this.props.input.value}
      />
    )
  }
}

export default FormikSelectInput
