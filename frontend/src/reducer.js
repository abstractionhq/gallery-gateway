import history from 'history'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import apollo from '../config/apollo'

export default function createReducer (asyncReducers = {}) {
  return connectRouter(history)(
    combineReducers({
      apollo: apollo.reducer(),
      ...asyncReducers
    })
  )
}
