import React from 'react'
import PropTypes from 'prop-types'

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
  <MultiCheckTable
    columns={columns}
    data={props.judges}
    unique='username'
    defaultSorted={[{ id: 'lastName', desc: false }]}
  />
)

JudgesTable.propTypes = {
  judges: PropTypes.array.isRequired
}

JudgesTable.defaultProps = {
  judges: []
}

export default JudgesTable
