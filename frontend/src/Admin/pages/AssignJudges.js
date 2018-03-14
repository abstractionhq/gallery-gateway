import React, { Component } from 'react'
import { Container } from 'reactstrap'
import styled from 'styled-components'
import Status from '../../shared/containers/Status'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AssignJudgesTable from '../containers/AssignJudgesTable'
import CreateJudgeForm from '../containers/CreateJudgeForm'
import NotFound from '../../shared/components/NotFound'
import { fetchShow } from '../actions'

const Heading = styled.h1`
  margin-bottom: 25px;
`

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`

class AssignJudges extends Component {
  static propTypes = {
    show: PropTypes.any // Object w/ 'id' and 'name' property or something falsey
  }

  componentDidMount () {
    const { id } = this.props.match.params

    if (id) {
      this.props.fetchData(id)
    }
  }

  renderPage (show) {
    return (
      <Container fluid>
        <Heading>Assign Judges | {show.name}</Heading>
        <Status />
        <AssignJudgesTable showId={show.id} />
        <FormContainer>
          <CreateJudgeForm />
        </FormContainer>
      </Container>
    )
  }

  render () {
    return this.props.show ? this.renderPage(this.props.show) : <NotFound />
  }
}

const mapStateToProps = ({ admin }, ownProps) => ({
  show: admin.shows[ownProps.match.params.id]
})

const mapDispatchToProps = dispatch => ({
  fetchData: showId => dispatch(fetchShow(showId))
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignJudges)
