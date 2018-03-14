import { combineReducers } from 'redux'

import { repeatableShuffle } from '../utils'
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
      if (!action.payload.submissions.length) {
        return state
      }

      const submissionsById = action.payload.submissions.reduce((accum, submission) => {
        accum[submission.id] = submission
        return accum
      }, {})
      return {
        ...state,
        ...submissionsById
      }
    default:
      return state
  }
}

// TODO: Calculate 'viewing' based on the first unvoted entry in 'order'
const initialQueueState = {
  order: [], // Array of entry id's
  viewing: 0 // The index in 'order' we're currently viewing
}

const queue = (state = initialQueueState, action) => {
  const { order, viewing } = state

  switch (action.type) {
    case actions.FETCH_SUBMISSIONS:
      const {
        submissions,
        username
      } = action.payload
      // Merge in the new submissions and perform a shuffle
      const submissionIds = submissions.map(submission => submission.id)
      const mergedOrder = Array.from(new Set([...order, ...submissionIds]))
      const shuffledOrder = repeatableShuffle(username, mergedOrder, x => x)
      return {
        ...state,
        order: shuffledOrder
      }
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
//   1: {order: ['1', '2', '3'], viewing: 0},
//   2: {order: ['9', '4', '5', '8', '6', '7'], viewing: 5}
// }
const queues = (state = {}, action) => {
  // Proxy all queue actions to the particular queue we want to target
  switch (action.type) {
    case actions.FETCH_SUBMISSIONS:
      // First, gather the submissions by show ID
      // (they _should_ be all the same ID anyway, but just in case)
      // Example:
      // {1: [{id: "1", show: {id: "1"}}, {id: "2", show: {id: "1"}}, {id: "3", show: {id: "1"}}]}
      const submissionsByShowId = action.payload.submissions.reduce(
        (accum, submission) => ({
          ...accum,
          [submission.show.id]: [
            // The accumulated submissions w/ the same show id,
            // or an empty array (when spread will be nothing) if there aren't any yet
            ...(accum[submission.show.id] || []),
            submission
          ]
        }),
        {}
      )
      // Proxy the action to each subqueue
      return Object.entries(submissionsByShowId).reduce(
        (accum, [showId, submissions]) => ({
          ...accum,
          [showId]: queue(
            accum[showId],
            {
              type: actions.FETCH_SUBMISSIONS,
              payload: {submissions, username: action.payload.username}
            }
          )
        }),
        state
      )
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

// Example State:
// {
//   31: {id: 31, entry: {id: 102}, value: 2},
//   34: {id: 34, entry: {id: 81}, value: 0}
// }
const votes = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_VOTES:
      const votes = action.payload.reduce((accum, vote) => {
        accum[vote.id] = vote
        return accum
      }, {})

      return {
        ...state,
        ...votes
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
  votes,
  ui
})
