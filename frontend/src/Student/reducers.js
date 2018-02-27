import { combineReducers } from 'redux'

import * as actions from './actions'

const students = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const ui = (
  state = {
    submission: {}
  },
  action
) => {
  switch (action.type) {
    case actions.UPLOAD_IMAGE:
    case actions.UPLOAD_PDF:
      if (!action.payload.path) {
        return state
      }

      return {
        ...state,
        submission: {
          ...state.submission,
          previewFile: action.payload
        }
      }
    case actions.CLEAR_PREVIEW:
      return {
        ...state,
        submission: {
          ...state.submission,
          previewFile: {}
        }
      }
    default:
      return state
  }
}

export default combineReducers({
  students,
  ui
})
