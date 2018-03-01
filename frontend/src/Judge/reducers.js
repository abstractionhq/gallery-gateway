import { combineReducers } from 'redux'

import * as actions from './actions'

// Example State:
// {
//   1: {id: '1', title...},
//   2: {id: '2', title...}
// }
const submissions = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_SUBMISSION:
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
    case actions.FETCH_SUBMISSIONS:
      if (!action.payload.length) {
        return state
      }

      const submissions = action.payload.reduce((accum, submission) => {
        accum[submission.id] = submission
        return accum
      }, {})
      return {
        ...state,
        ...submissions
      }
    default:
      return state
  }
}

// TODO: Produce 'order' based on shuffling the entry id's that are in this show
// TODO: Calculate 'viewing' based on the first unvoted entry in 'order'
const initialQueueState = {
  order: [], // Array of entry id's
  viewing: 0 // The index in 'order' we're currently viewing
}

const queue = (state = initialQueueState, action) => {
  const { order, viewing } = state

  switch (action.type) {
    case actions.NEXT_IN_QUEUE:
      return {
        ...state,
        // Continue incrementing until we've reached the end of the list.
        // Then continue to return the index of the last element.
        viewing: viewing + 1 < order.length ? viewing + 1 : viewing
      }
    case actions.PREVIOUS_IN_QUEUE:
      return {
        ...state,
        // Continue decrementing until we've reached the beginning of the list.
        // Then continue to return the index of the first element (i.e. 0).
        viewing: viewing > 0 ? viewing - 1 : viewing
      }
    default:
      return state
  }
}

// Each show has a queue whose key in the queues state is the show's id
// Example State:
// {
//   1: {order: [1, 2, 3], viewing: 0},
//   2: {order: [9, 4, 5, 8, 6, 7], viewing: 5}
// }
const queues = (state = {}, action) => {
  // Proxy all queue actions to the particular queue we want to target
  switch (action.type) {
    case actions.NEXT_IN_QUEUE:
    case actions.PREVIOUS_IN_QUEUE:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: queue(state[action.payload.id], action)
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
  queues,
  submissions,
  ui
})
