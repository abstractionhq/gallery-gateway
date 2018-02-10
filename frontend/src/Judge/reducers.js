import { combineReducers } from 'redux'

import * as actions from './actions'

const ui = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  ui
})