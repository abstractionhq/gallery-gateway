import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'

import UsersTable from './UsersTable'
import CreateAdminForm from '../containers/CreateAdminForm'

class ManageAdminsTab extends Component {
  static propTypes = {
    admins: PropTypes.array.isRequired,
    fetchAdmins: PropTypes.func.isRequired
  }

  static defaultProps = {
    admins: []
  }

  componentDidMount () {
    this.props.fetchAdmins()
  }

  render () {
    const { admins } = this.props

    return (
      <Row>
        <Col xs='12'>
          <UsersTable data={admins} />
        </Col>
        <Col xs='12' className='mt-5'>
          <CreateAdminForm />
        </Col>
      </Row>
    )
  }
}

export default ManageAdminsTab
