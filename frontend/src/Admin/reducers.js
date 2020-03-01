import { combineReducers } from 'redux'

import * as actions from './actions'

// Example State:
// {
//   1: {id: '1', name...},
//   2: {id: '2', name...}
// }
const shows = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_SHOW:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }
    case actions.FETCH_SHOWS:
      if (!action.payload.length) {
        return state
      }

      const shows = action.payload.reduce((accum, show) => {
        accum[show.id] = show
        return accum
      }, {})
      return {
        ...state,
        ...shows
      }
    case actions.FETCH_JUDGES_FOR_SHOW:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          judges: action.payload.judges
        }
      }
    default:
      return state
  }
}

// Example State:
// {
//   user1: { username: 'user1', firstName... }
//   user2: { username: 'user2', firstName... }
// }
const admins = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_ADMINS:
      if (!action.payload.length) {
        return state
      }

      const admins = action.payload.reduce((accum, admin) => {
        accum[admin.username] = admin
        return accum
      }, {})
      return {
        ...state,
        ...admins
      }
    case actions.ADD_ADMIN:
      if (!action.payload.username) {
        return state
      }

      return {
        ...state,
        [action.payload.username]: action.payload
      }
    default:
      return state
  }
}

// Example State:
// {
//   user1: { username: 'user1', firstName... }
//   user2: { username: 'user2', firstName... }
// }
const judges = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_JUDGES:
      if (!action.payload.length) {
        return state
      }

      const judges = action.payload.reduce((accum, judge) => {
        accum[judge.username] = judge
        return accum
      }, {})
      return {
        ...state,
        ...judges
      }
    case actions.ADD_JUDGE:
      if (!action.payload.username) {
        return state
      }

      return {
        ...state,
        [action.payload.username]: action.payload
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
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: Object.values(action.payload.judges).map(
          judge => judge.username
        )
      }
    case actions.ASSIGN_JUDGES_TO_SHOW:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: [
          ...state[action.payload.id],
          ...action.payload.usernames
        ]
      }
    case actions.REMOVE_JUDGES_FROM_SHOW:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: state[action.payload.id].filter(
          judge => !action.payload.usernames.includes(judge)
        )
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

const portfolioPeriods = (state = {}, action) => {
  switch (action.type){
    case actions.FETCH_PORTFOLIO_PERIOD:
      if (!action.payload.id){
        return state
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }
    case actions.FETCH_PORTFOLIO_PERIODS:
      if (!action.payload.length) {
        return state
      }

      const portfolioPeriods = action.payload.reduce((accum, portfolioPeriod) => {
        accum[portfolioPeriod.id] = portfolioPeriod
        return accum
      }, {})
      return {
        ...state,
        ...portfolioPeriods
      }
    default:
      return state
  }
}

const portfolioPeriodAssignments = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_JUDGES_BY_ASSIGNMENT_FOR_PORTFOLIO_PERIOD:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: Object.values(action.payload.judges).map(
          judge => judge.username
        )
      }
    case actions.ASSIGN_JUDGES_TO_PORTFOLIO_PERIOD:
      if (!action.payload.id) {
        return state
      }
      
      return {
        ...state,
        [action.payload.id]: [
          ...state[action.payload.id],
          ...action.payload.usernames
        ]
      }
    case actions.REMOVE_JUDGES_FROM_PORTFOLIO_PERIOD:
      if (!action.payload.id) {
        return state
      }
  
      return {
        ...state,
        [action.payload.id]: state[action.payload.id].filter(
          judge => !action.payload.usernames.includes(judge)
        )
      }
    default:
      return state
  }
}

export default combineReducers({
  shows,
  admins,
  judges,
  assignments,
  portfolioPeriods,
  portfolioPeriodAssignments,
  ui
})
