import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'

import AssignJudgesTable from '../containers/AssignJudgesTable'
import CreateJudgeForm from '../containers/CreateJudgeForm'
import NotFound from '../../shared/components/NotFound'
import { fetchShow } from '../actions'

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
      <Fragment>
        <Container>
          <Row>
            <Col>
              <h1>{show.name}</h1>
            </Col>
          </Row>
          <hr />
        </Container>
        <Container fluid>
          <AssignJudgesTable showId={show.id} />
          <FormContainer>
            <CreateJudgeForm />
          </FormContainer>
        </Container>
      </Fragment>
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AssignJudges
)
