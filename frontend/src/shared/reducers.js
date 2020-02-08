import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'connected-react-router'

import * as actions from './actions'

//
// Example state:
// {
//   'token': '...',
//   'downloadToken': '...',
//   'user': {
//     'username': 'souperManne',
//     'firstName': 'Clark',
//     'lastName': 'Kent',
//     'type': 'ADMIN',
//     'createdAt': '...',
//     'hometown': 'Smallville'
//     'iat': 1516390788 # expiry in epoch-seconds
//   },
//   'performingRole': 'JUDGE'
// }
//
const auth = (state = {}, action) => {
  switch (action.type) {
    case actions.LOGIN_USER:
      if (!action.payload || !action.payload.token || !action.payload.user) {
        return state
      }
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user
      }
    case actions.LOGOUT_USER:
      return {}
    case actions.SWITCH_TO_JUDGE:
      return {
        ...state,
        performingRole: 'JUDGE'
      }
    case actions.SWITCH_TO_ADMIN:
      return {
        ...state,
        performingRole: 'ADMIN'
      }
    case actions.GET_DOWNLOAD_TOKEN:
      if (!action.payload) {
        return state
      }
      return {
        ...state,
        downloadToken: action.payload
      }
    case actions.SET_USER_HOMETOWN:
      if (state.user.hometown) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          hometown: action.payload
        }
      }
    case actions.SET_USER_DISPLAY_NAME:
      if (state.user.displayName) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          displayName: action.payload
        }
      }
    default:
      return state
  }
}

// 'errors' is a list of strings
const errors = (state = [], action) => {
  switch (action.type) {
    case actions.DISPLAY_ERROR:
      if (!action.payload) {
        return state
      }

      // Append the error to the end of the list
      return [...state, action.payload]
    case actions.DISMISS_ERROR:
      if (action.payload === undefined) {
        // We can get 0 as a payload
        return state
      }

      // Remove the element from the array at the index specified in the payload
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1)
      ]
    case LOCATION_CHANGE:
      // Dismiss all errors if you navigate to another page
      return []
    default:
      return state
  }
}

export default combineReducers({
  auth,
  errors
})
