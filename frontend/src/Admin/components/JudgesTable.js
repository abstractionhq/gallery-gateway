import React from 'react'
import PropTypes from 'prop-types'

import CheckboxTable from 'shared/components/CheckboxTable'

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
  <CheckboxTable
    columns={columns}
    data={props.judges}
    unique='username'
    selected={props.selected}
    onChange={props.onChange}
    defaultSorted={[{ id: 'lastName', desc: false }]}
  />
)

JudgesTable.propTypes = {
  judges: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

JudgesTable.defaultProps = {
  judges: [],
  selected: {}
}

export default JudgesTable
