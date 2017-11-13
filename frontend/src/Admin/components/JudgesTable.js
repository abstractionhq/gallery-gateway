import React from 'react'

import MultiCheckTable from 'shared/components/MultiCheckTable'

const columns = [
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

const JudgesTable = (props) => (
  props.loading
    ? null
    : <MultiCheckTable
      columns={columns}
      data={props.judges}
      unique='username'
      defaultSorted={[{ id: 'lastName', desc: false }]}
    />
)

export default JudgesTable
