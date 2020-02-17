import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import PortfolioFormChooser from '../components/PortfolioFormChooser'
import PortfolioPhotoForm from '../containers/PortfolioPhotoForm'
import PortfolioVideoForm from '../containers/PortfolioVideoForm'
import PortfolioOtherMediaForm from '../containers/PortfolioOtherMediaForm'

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
        render={() => <PortfolioVideoForm id={addIdPropFromQueryParams()} />}
      />
      <Route
        exact
        path='/add/other'
        render={() => (
          <PortfolioOtherMediaForm id={addIdPropFromQueryParams()} />
        )}
      />
    </Switch>
  </Container>
)

export default Add
