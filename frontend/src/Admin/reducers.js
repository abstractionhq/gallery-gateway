import { combineReducers } from 'redux'

import * as actions from './actions'

const shows = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_SHOWS:
      return {
        ...state,
        ...action.payload
      }
    case actions.FETCH_JUDGES_FOR_SHOW:
      return {
        ...state,
        [action.showId]: {
          ...state[action.showId],
          judges: action.payload
        }
      }
    default:
      return state
  }
}

// Example State:
// {
//   1: { username: 'user1' }
//   2: { username: 'user2' }
// }
const judges = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_JUDGES:
      // NOTE: Currently, the Apollo normalized id's are arbitrary and don't correspond
      // to the id specified in 'dataIdFromObject'
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

// Example State:
// {
//   1: ['user1', 'user2'],
//   2: ['user1']
// }
const assignments = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW:
      return {
        ...state,
        [action.showId]: action.payload
      }
    default:
      return state
  }
}

const ui = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  shows,
  judges,
  assignments,
  ui
})
