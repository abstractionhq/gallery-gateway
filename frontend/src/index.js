import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'

import apollo from '../config/apollo'
import history from './history'
import store from './store'

import Admin from './Admin/Page'
import Home from './Home/Page'
import NotFound from './shared/components/NotFound'

import 'bootstrap/dist/css/bootstrap.css'

const Root = () => (
  <ApolloProvider store={store} client={apollo}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/admin' component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </ApolloProvider>
)

export default Root
