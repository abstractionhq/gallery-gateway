import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'

import StudentsTable from './StudentsTable'
import Loading from '../../shared/components/Loading'

class ManageStudentsTab extends Component {
  static propTypes = {
    students: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    create: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    students: []
  }

  componentDidUpdate () {
    const { error, handleError } = this.props
    if (error) {
      error.graphQLErrors.forEach(e => {
        handleError(e.message)
      })
    }
  }

  render () {
    const { loading, students, handleError, create } = this.props

    return (
      <Row>
        <Col xs='12'>
          {loading ? <Loading /> : <StudentsTable data={students} handleError={handleError} create={create}/>}
        </Col>
      </Row>
    )
  }
}

export default ManageStudentsTab
