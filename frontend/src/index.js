// Initialize Global Imports
import 'moment-timezone' // See: https://github.com/headzoo/react-moment#timezone-support
import 'react-dates/initialize' // See: https://github.com/airbnb/react-dates#initialize
import 'bootstrap/dist/css/bootstrap.css' // See: https://github.com/reactstrap/reactstrap#adding-bootstrap
import 'react-dates/lib/css/_datepicker.css' // See: https://github.com/airbnb/react-dates#webpack
import 'react-table/react-table.css' // See: https://github.com/react-tools/react-table#installation

import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import apollo from '../config/apollo'
import history from './history'
import store from './store'

import LoginSwitch from './shared/components/LoginSwitch'

const Root = () => (
  <ApolloProvider client={apollo}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <LoginSwitch />
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>
)

export default Root
