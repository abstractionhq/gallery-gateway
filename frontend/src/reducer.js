import history from 'history'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

export default function createReducer (asyncReducers = {}) {
  return connectRouter(history)(
    combineReducers({
      ...asyncReducers
    })
  )
}
