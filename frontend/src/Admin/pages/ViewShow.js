import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col
} from 'reactstrap'
import queryString from 'query-string'

import ShowQuery from '../queries/show.graphql'

class ViewShow extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    show: PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  }

  goToTab (tab) {
    if (tab === this.props.tab) {
      return
    }
    const { id: showId } = this.props.match.params
    const newQueryString = queryString.stringify({
      ...queryString.parse(this.props.location.search),
      tab: tab
    })
    this.props.history.push(`/show/${showId}?${newQueryString}`)
  }

  render () {
    if (this.props.loading) {
      return null
    }

    return (
      <Container>
        <Row>
          <Col>
            <h1>{this.props.show.name}</h1>
          </Col>
        </Row>
        <hr />
        <Nav tabs>
          <NavItem>
            <NavLink
              className={this.props.tab === '1' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.goToTab('1')}
            >
              Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={this.props.tab === '2' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.goToTab('2')}
            >
              Submissions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={this.props.tab === '3' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.goToTab('3')}
            >
              Judges
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.props.tab}>
          <TabPane tabId='1'>
            <Row>
              <Col>Details</Col>
            </Row>
          </TabPane>
          <TabPane tabId='2'>
            <Row>
              <Col>Submissions</Col>
            </Row>
          </TabPane>
          <TabPane tabId='3'>
            <Row>
              <Col>Judges</Col>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let { tab } = queryString.parse(ownProps.location.search)
  const { id: showId } = ownProps.match.params

  // If tab is invalid, destroy it
  if (tab !== '1' && tab !== '2' && tab !== '3') {
    tab = null
  }

  if (!tab) {
    // Update the query-string to contain the currently active tab, if needed
    const newQueryString = queryString.stringify({
      ...queryString.parse(ownProps.location.search),
      tab: '1'
    })
    ownProps.history.replace(`/show/${showId}?${newQueryString}`)
  }

  return {
    tab
  }
}

const withQuery = compose(
  connect(mapStateToProps, null),
  graphql(ShowQuery, {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    }),
    props: ({ data: { show, loading } }) => ({
      show,
      loading
    })
  })
)(ViewShow)

export default withQuery
