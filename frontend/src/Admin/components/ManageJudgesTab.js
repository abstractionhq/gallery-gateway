import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'

import UsersTable from './UsersTable'
import CreateJudgeForm from '../containers/CreateJudgeForm'

class ManageJudgesTab extends Component {
  static propTypes = {
    judges: PropTypes.array.isRequired,
    fetchJudges: PropTypes.func.isRequired
  }

  static defaultProps = {
    judges: []
  }

  componentDidMount () {
    this.props.fetchJudges()
  }

  render () {
    const { judges } = this.props

    return (
      <Row>
        <Col xs='12'>
          <UsersTable data={judges} />
        </Col>
        <Col xs='12' className='mt-5'>
          <CreateJudgeForm />
        </Col>
      </Row>
    )
  }
}

export default ManageJudgesTab
