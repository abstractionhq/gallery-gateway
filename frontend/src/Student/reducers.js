import { combineReducers } from 'redux'

import * as actions from './actions'

const students = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  students
})
