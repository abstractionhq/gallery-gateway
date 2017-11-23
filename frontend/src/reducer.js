import history from 'history'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'

export default function createReducer (asyncReducers = {}) {
  return connectRouter(history)(
    combineReducers({
      form: formReducer,
      ...asyncReducers
    })
  )
}
