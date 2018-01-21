import history from 'history'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'

import AdminReducer from './Admin/reducers'
import StudentReducer from './Student/reducers'

export default function createReducer (asyncReducers = {}) {
  return connectRouter(history)(
    combineReducers({
      form: formReducer,
      admin: AdminReducer,
      student: StudentReducer,
      ...asyncReducers
    })
  )
}
