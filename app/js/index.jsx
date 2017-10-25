import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import store from './store';
import history from './history';
import apolloClient from './apolloClient';

const Root = () => (
  <ApolloProvider store={store} client={apolloClient}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={() => <div>Hello World!</div>} />
      </Switch>
    </ConnectedRouter>
  </ApolloProvider>
);

export default Root;
