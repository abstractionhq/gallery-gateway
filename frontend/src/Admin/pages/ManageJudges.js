import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { fetchJudges } from '../actions'
import CreateJudgeForm from '../containers/CreateJudgeForm'

class ManageJudges extends Component {
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
      <Container>
        <h1>Judges</h1>
        <Row>
          <Col xs='12'>
            <ReactTable
              data={judges}
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
                }
              ]}
              defaultPageSize={15}
              defaultSorted={[{ id: 'lastName', desc: false }]}
              resizable={false}
              className='-striped -highlight'
            />
          </Col>
          <Col xs='12' className='mt-5'>
            <CreateJudgeForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  judges: Object.values(state.admin.judges)
})

const mapDispatchToProps = dispatch => ({
  fetchJudges: () => dispatch(fetchJudges())
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ManageJudges)
