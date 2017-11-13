import React, { Component } from 'react'
import ReactTable from 'react-table'
import PropTypes from 'prop-types'

import 'react-table/react-table.css'

const UNCHECKED = 0
const CHECKED = 1
const INDETERMINATE = 2

class MultiCheckTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    unique: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      selected: {},
      selectAll: UNCHECKED
    }
  }

  toggleRow = (unique) => {
    const {
      data
    } = this.props

    const newSelected = {
      ...this.state.selected
    }

    if (newSelected[unique]) {
      // We're unchecking this row, so remove the key
      delete newSelected[unique]
    } else {
      // We're checking this row, so add it in
      newSelected[unique] = true
    }

    const numSelected = Object.keys(newSelected).length
    /* eslint-disable */
    const selectAllState = do {
      if (numSelected === Object.keys(data).length) {
        CHECKED
      } else if (numSelected === 0) {
        UNCHECKED
      } else {
        INDETERMINATE
      }
    }
    /* eslint-enable */

    this.setState({
      selected: newSelected,
      selectAll: selectAllState
    })
  }

  toggleSelectAll = () => {
    const {
      data,
      unique
    } = this.props

    const newSelected = {}

    // If all are UNCHECKED, check them all
    // Otherwise, if we're in a CHECKED or INDETERMINATE state, uncheck them all
    if (this.state.selectAll === UNCHECKED) {
      data.forEach(row => {
        newSelected[row[unique]] = true
      })
    }

    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === UNCHECKED ? CHECKED : UNCHECKED
    })
  }

  render () {
    const {
      loading,
      data,
      columns,
      unique,
      ...otherProps
    } = this.props

    const tableColumns = [
      {
        id: 'checkbox',
        accessor: '',
        maxWidth: 50,
        sortable: false,
        Cell: ({ original }) => (
          <input
            type='checkbox'
            checked={!!this.state.selected[original[unique]]}
            onChange={() => this.toggleRow(original[unique])}
          />
        ),
        Header: x => (
          <input
            type='checkbox'
            checked={this.state.selectAll === CHECKED}
            ref={input => {
              if (input) {
                input.indeterminate = this.state.selectAll === INDETERMINATE
              }
            }}
            onChange={() => this.toggleSelectAll()}
          />
        ),
        style: {
          textAlign: 'center'
        }
      },
      ...columns
    ]

    return (
      loading
        ? null
        : <ReactTable
          data={data}
          columns={tableColumns}
          defaultPageSize={10}
          resizable={false}
          className='-striped -highlight'
          {...otherProps}
        />
    )
  }
}

export default MultiCheckTable
