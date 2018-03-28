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

      const submissionsById = action.payload.submissions.reduce(
        (accum, submission) => {
          accum[submission.id] = submission
          return accum
        },
        {}
      )
      return {
        ...state,
        ...submissionsById
      }
    default:
      return state
  }
}

const initialQueueState = {
  order: [], // Array of entry id's
  loadingSubmissions: false,
  loadingVotes: false
}

const queue = (state = initialQueueState, action) => {
  switch (action.type) {
    case actions.FETCH_SUBMISSIONS:
      const submissionIds = action.payload.submissions.map(
        submission => submission.id
      )
      const shuffledOrder = repeatableShuffle(
        action.payload.username,
        submissionIds,
        x => x
      )
      return {
        ...state,
        order: shuffledOrder,
        loadingSubmissions: false
      }
    case actions.FETCH_VOTES:
      return {
        ...state,
        loadingVotes: false
      }
    case actions.WILL_FETCH_SUBMISSIONS:
      return {
        ...state,
        loadingSubmissions: true
      }
    case actions.WILL_FETCH_VOTES:
      return {
        ...state,
        loadingVotes: true
      }
    default:
      return state
  }
}

// Each show has a queue whose key in the queues state is the show's id
// Example State:
// {
//   1: {order: ['1', '2', '3'], loadingSubmissions: true, loadingVotes: false},
//   2: {order: ['9', '4', '5', '8', '6', '7'], loadingSubmissions: true, loadingVotes: false}
// }
const queues = (state = {}, action) => {
  // Proxy all queue actions to the particular queue we want to target
  switch (action.type) {
    case actions.FETCH_SUBMISSIONS:
      if (action.payload.submissions.length === 0) {
        return state
      }
      // proxy the action to the subqueue
      const showId = action.payload.submissions[0].show.id
      return {
        ...state,
        [showId]: queue(state[showId], action)
      }
    case actions.WILL_FETCH_SUBMISSIONS:
    case actions.WILL_FETCH_VOTES:
      return {
        ...state,
        [action.payload]: queue(state[action.payload], action)
      }
    case actions.FETCH_VOTES:
      return {
        ...state,
        [action.payload.showId]: queue(state[action.payload.showId], action)
      }
    default:
      return state
  }
}

// Example State:
// {
//  byId: {
//    31: {id: 31, entry: {id: 102}, value: 2},
//    34: {id: 34, entry: {id: 81}, value: 0}
//  }
//  byEntryId: {
//    81: {id: 34, entry: {id: 81}, value: 0},
//    102: {id: 31, entry: {id: 102}, value: 2}
//  }
// }
const initialVoteState = {
  byId: {},
  byEntryId: {}
}

const votes = (state = initialVoteState, action) => {
  switch (action.type) {
    case actions.FETCH_VOTES:
      if (!action.payload.votes.length) {
        return state
      }

      const votesById = action.payload.votes.reduce((accum, vote) => {
        accum[vote.id] = vote
        return accum
      }, {})
      const votesByEntryId = action.payload.votes.reduce((accum, vote) => {
        accum[vote.entry.id] = vote
        return accum
      }, {})

      return {
        ...state,
        byId: {
          ...state.byId,
          ...votesById
        },
        byEntryId: {
          ...state.byEntryId,
          ...votesByEntryId
        }
      }
    case actions.FETCH_VOTE:
      if (!action.payload.id) {
        return state
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload
        },
        byEntryId: {
          ...state.byEntryId,
          [action.payload.entry.id]: action.payload
        }
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
