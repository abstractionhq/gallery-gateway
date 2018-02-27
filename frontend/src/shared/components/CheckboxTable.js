import React, { Component } from 'react'
import ReactTable from 'react-table'
import PropTypes from 'prop-types'

class MultiCheckTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    unique: PropTypes.string.isRequired,
    // eg. if 'unique' is 'username',
    // 'selected' could be used like:
    // { user1: true, user2: true }
    // but should not be used like:
    // { user1: false }
    // as this component only checks for prescence in 'selected' and total
    // number of keys. In the second example 'user1' would still be considered selected.
    // Also note, this component does not verify that the keys in 'selected' are valid 'unique' properties in 'data'.
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: [],
    selected: {}
  }

  handleSelectRow = row => {
    const { selected, onChange } = this.props

    const rows = {
      ...selected
    }
    if (rows[row]) {
      // We're unchecking this row, so remove the key
      delete rows[row]
    } else {
      // We're checking this row, so add it in
      rows[row] = true
    }

    onChange(rows)
  }

  handleSelectAll = () => {
    const { data, unique, selected, onChange } = this.props

    // If none are selected, select them all
    // If some are selected, unselect them all (aka select none of them)
    const areSomeSelected = Object.keys(selected).length > 0
    const rows = {}

    if (!areSomeSelected) {
      data.forEach(row => {
        rows[row[unique]] = true
      })
    }

    onChange(rows)
  }

  render () {
    const { data, columns, unique, selected, ...otherProps } = this.props

    const numSelected = Object.keys(selected).length
    const isSelectAllIndeterminate =
      numSelected > 0 && numSelected < data.length

    const tableColumns = [
      {
        id: 'checkbox',
        accessor: '',
        maxWidth: 50,
        sortable: false,
        Cell: ({ original }) => (
          <input
            type='checkbox'
            checked={!!selected[original[unique]]}
            onChange={() => this.handleSelectRow(original[unique])}
          />
        ),
        Header: x => (
          <input
            type='checkbox'
            checked={data.length > 0 && numSelected === data.length}
            disabled={data.length === 0}
            ref={input => {
              if (input) {
                input.indeterminate = isSelectAllIndeterminate
              }
            }}
            onChange={() => this.handleSelectAll()}
          />
        ),
        style: {
          textAlign: 'center'
        }
      },
      ...columns
    ]

    return (
      <ReactTable
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
