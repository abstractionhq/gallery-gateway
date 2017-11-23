import * as actions from './actions'

const initialState = {
  shows: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_JUDGES:
    case actions.FETCH_JUDGES_FOR_SHOW:
    case actions.FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW:
      return action.payload
    default:
      return state
  }
}
