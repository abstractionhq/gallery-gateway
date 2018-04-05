import React from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import { TabContent, TabPane, Container, Row, Col } from 'reactstrap'
import { RoutedTabs, NavTab } from 'react-router-tabs'
import { Route, Switch } from 'react-router-dom'

import ShowDetailsTab from '../containers/ShowDetailsTab'
import ShowSubmissionsTab from '../containers/ShowSubmissionsTab'
import ShowJudgesTab from '../components/ShowJudgesTab'
import ShowQuery from '../queries/show.graphql'

const ViewShow = props => {
  if (props.loading) {
    return null
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>{props.show.name}</h1>
        </Col>
      </Row>

      <hr />

      {/* We must use 'match.url' as the base because it contains the show id */}
      <RoutedTabs
        startPathWith={props.match.url}
        className='nav nav-tabs'
        style={{ marginBottom: '1rem' }}
      >
        {/* 'replace={false} makes it so tab navigation is in the browser history */}
        <NavTab exact to='' replace={false} className='nav-item nav-link'>
          Details
        </NavTab>
        <NavTab
          exact
          to='/submissions'
          replace={false}
          className='nav-item nav-link'
        >
          Submissions
        </NavTab>
        <NavTab
          exact
          to='/judges'
          replace={false}
          className='nav-item nav-link'
        >
          Judges
        </NavTab>
      </RoutedTabs>

      <TabContent>
        <TabPane>
          <Switch>
            <Route
              exact
              path={`${props.match.path}`}
              render={() => <ShowDetailsTab show={props.show} />}
            />
            <Route
              path={`${props.match.path}/submissions`}
              render={() => <ShowSubmissionsTab show={props.show} />}
            />
            <Route
              path={`${props.match.path}/judges`}
              render={() => <ShowJudgesTab show={props.show} />}
            />
          </Switch>
        </TabPane>
      </TabContent>
    </Container>
  )
}

ViewShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  show: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
}

const withQuery = graphql(ShowQuery, {
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.id
    }
  }),
  props: ({ data: { show, loading } }) => ({
    show,
    loading
  })
})(ViewShow)

export default withQuery
