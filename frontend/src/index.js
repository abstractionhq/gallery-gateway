import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

// Initialize Global Imports
import 'react-dates/initialize' // See: https://github.com/airbnb/react-dates#initialize

import apollo from '../config/apollo'
import history from './history'
import store from './store'

import ErrorHandler from './shared/components/ErrorHandler'
import LoginSwitch from './shared/components/LoginSwitch'

// Import Global CSS
import 'bootstrap/dist/css/bootstrap.css' // See: https://github.com/reactstrap/reactstrap#adding-bootstrap
import 'react-dates/lib/css/_datepicker.css' // See: https://github.com/airbnb/react-dates#webpack
import 'react-table/react-table.css' // See: https://github.com/react-tools/react-table#installation

const Root = () => (
  <ApolloProvider client={apollo}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ErrorHandler>
          <LoginSwitch />
        </ErrorHandler>
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>
)

export default Root
