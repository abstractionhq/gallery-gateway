import React, { Component } from 'react'
import ReactTable from 'react-table'

import 'react-table/react-table.css'

const UNCHECKED = 0
const CHECKED = 1
const INDETERMINATE = 2

export default class JudgesTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: {},
      selectAll: UNCHECKED
    }
  }

  toggleRow = (username) => {
    const {
      judges
    } = this.props

    const newSelected = {
      ...this.state.selected
    }

    if (newSelected[username]) {
      // We're unchecking this row, so remove the key
      delete newSelected[username]
    } else {
      // We're checking this row, so add it in
      newSelected[username] = true
    }

    const numSelected = Object.keys(newSelected).length
    /* eslint-disable */
    const selectAllState = do {
      if (numSelected === Object.keys(judges).length) {
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
      judges
    } = this.props

    const newSelected = {}

    // If all are UNCHECKED, check them all
    // Otherwise, if we're in a CHECKED or INDETERMINATE state, uncheck them all
    if (this.state.selectAll === UNCHECKED) {
      judges.forEach(row => {
        newSelected[row.username] = true
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
      judges
    } = this.props

    const columns = [
      {
        id: 'checkbox',
        accessor: '',
        maxWidth: 50,
        sortable: false,
        Cell: ({ original }) => (
          <input
            type='checkbox'
            checked={!!this.state.selected[original.username]}
            onChange={() => this.toggleRow(original.username)}
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
      {
        Header: 'Last Name',
        accessor: 'lastName'
      },
      {
        Header: 'First Name',
        accessor: 'firstName'
      },
      {
        Header: 'Username',
        accessor: 'username'
      }
    ]

    return (
      loading
        ? null
        : <ReactTable
          data={judges}
          columns={columns}
          defaultPageSize={10}
          resizable={false}
          className='-striped -highlight'
          defaultSorted={[{ id: 'lastName', desc: false }]}
        />
    )
  }
}
