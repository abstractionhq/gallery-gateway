import history from 'history'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'

import AdminReducer from './Admin/reducers'
import SharedReducer from './shared/reducers'
import StudentReducer from './Student/reducers'
import JudgeReducer from './Judge/reducers'

export default function createReducer (asyncReducers = {}) {
  return connectRouter(history)(
    combineReducers({
      form: formReducer,
      admin: AdminReducer,
      shared: SharedReducer,
      student: StudentReducer,
      judge: JudgeReducer,
      ...asyncReducers
    })
  )
}
