import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'

const UsersTable = props => (
  <ReactTable
    data={props.data}
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
        accessor: 'hometown'
      }
    ]}
    defaultPageSize={10}
    defaultSorted={[{ id: 'lastName', desc: false }]}
    resizable={false}
    className='-striped -highlight'
  />
)

UsersTable.propTypes = {
  data: PropTypes.array.isRequired
}

UsersTable.defaultProps = {
  data: []
}

export default UsersTable
