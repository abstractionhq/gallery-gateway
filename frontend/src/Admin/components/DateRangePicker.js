import React, { Component } from 'react'
import { DateRangePicker } from 'react-dates'
import { START_DATE, END_DATE } from 'react-dates/constants'

// See: https://github.com/erikras/redux-form/issues/1860#issuecomment-315188615
class DateRangePickerWrapper extends Component {
  constructor (props) {
    super(props)

    this.state = {
      focusedInput: null
    }
  }

  handleDatesChange = dates => {
    const startField = this.props[this.props.startDateFieldName]
    const endField = this.props[this.props.endDateFieldName]
    startField.input.onChange(dates.startDate)
    endField.input.onChange(dates.endDate)
  }

  handleFocusChange = focusedInput => {
    this.setState({ focusedInput })
    if (focusedInput === START_DATE) {
      this.props[this.props.startDateFieldName].input.onFocus()
      return
    }
    if (focusedInput === END_DATE) {
      this.props[this.props.endDateFieldName].input.onFocus()
    }
  }

  render () {
    const startDate =
      this.props[this.props.startDateFieldName].input.value || null
    const endDate = this.props[this.props.endDateFieldName].input.value || null

    return (
      <DateRangePicker
        endDate={endDate}
        endDatePlaceholderText='End Date'
        focusedInput={this.state.focusedInput}
        onDatesChange={this.handleDatesChange}
        onFocusChange={this.handleFocusChange}
        startDate={startDate}
        startDatePlaceholderText='Start Date'
        isOutsideRange={() => false} // Allows any past date to be chosen
      />
    )
  }
}

export default DateRangePickerWrapper
