import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import {Row, Col} from 'reactstrap'
import EditHometown from './EditHometown'

class StudentsTable extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired
  }
  
  static defaultProps = {
    data: []
  }


  render() {
    const { data, handleError, create } = this.props

  return(
  <ReactTable
    data = {data}
    columns={[
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
      },
      {
        Header: 'Hometown',
        Cell: ({ original }) => (
          <div><EditHometown create={create} handleError={handleError} student={original}></EditHometown>
          </div>
        )
      }
    ]}
    defaultPageSize={10}
    defaultSorted={[{ id: 'lastName', desc: false }]}
    resizable={false}
    className='-striped -highlight'
  />)
  }
}

export default StudentsTable
