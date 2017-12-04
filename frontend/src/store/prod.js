import history from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import createReducer from '../reducer'
import client from '../../config/apollo'

const store = createStore(
  createReducer(),
  compose(
    applyMiddleware(thunk.withExtraArgument(client), routerMiddleware(history)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store
