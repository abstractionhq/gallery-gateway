import { combineReducers } from 'redux'
import * as actions from './actions'

//
// Example state:
// {
//   'token': '...',
//   'user': {
//     'username': 'souperManne',
//     'firstName': 'Clark',
//     'lastName': 'Kent',
//     'type': 'ADMIN',
//     'createdAt': '...',
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
    case actions.JUDGE_ROLE:
      return {
        ...state,
        performingRole: 'JUDGE'
      }
    case actions.ADMIN_ROLE:
      return {
      ...state,
      performingRole: 'ADMIN'
    } 
    default:
      return state
  }
}

export default combineReducers({
  auth
})
