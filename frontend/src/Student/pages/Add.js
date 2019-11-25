import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import PortfolioFormChooser from '../components/PortfolioFormChooser'
import PortfolioPhotoForm from '../containers/PortfolioPhotoForm'
import VideoSubmissionForm from '../containers/VideoSubmissionForm'
import OtherMediaSubmissionForm from '../containers/OtherMediaSubmissionForm'

// TODO: Make more robust
const addIdPropFromQueryParams = () => {
  return window.location.search.split('=')[1]
}

const Add = props => (
  <Container>
    <Switch>
      <Route
        exact
        path='/add'
        render={() => <PortfolioFormChooser id={addIdPropFromQueryParams()} />}
      />
      <Route
        exact
        path='/add/photo'
        render={() => <PortfolioPhotoForm id={addIdPropFromQueryParams()} />}
      />
      <Route
        exact
        path='/add/video'
        render={() => <VideoSubmissionForm id={addIdPropFromQueryParams()} />}
      />
      <Route
        exact
        path='/add/other'
        render={() => (
          <OtherMediaSubmissionForm id={addIdPropFromQueryParams()} />
        )}
      />
    </Switch>
  </Container>
)

export default Add
