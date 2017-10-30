import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'

import apollo from '../config/apollo'
import history from './history'
import store from './store'

const Root = () => (
  <ApolloProvider store={store} client={apollo}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={() => <div>Hello World!</div>} />
      </Switch>
    </ConnectedRouter>
  </ApolloProvider>
)

export default Root
