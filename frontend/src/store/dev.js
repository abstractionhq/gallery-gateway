import history from '../history'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools' // eslint-disable-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'

import createReducer from '../reducer'
import client from '../../config/apollo'

function getDebugSessionKey () {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  return matches && matches.length > 0 ? matches[1] : null
}

const store = createStore(
  createReducer(),
  compose(
    applyMiddleware(thunk.withExtraArgument(client), routerMiddleware(history)),
    persistState(getDebugSessionKey()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

if (module.hot) {
  module.hot.accept('../reducer', () => {
    const nextReducer = require('../reducer').default // eslint-disable-line global-require

    store.replaceReducer(nextReducer)
  })
}

export default store
