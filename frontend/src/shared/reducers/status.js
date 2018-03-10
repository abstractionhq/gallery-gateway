import { LOADING_STATUS, ERROR_STATUS, CLOSE_STATUS, WARNING_STATUS } from '../actions'
import { LOCATION_CHANGE } from 'connected-react-router'

const initState = {
  loading: {}, // If empty no loading
  info: null,
  error: null
}

export default (state = initState, action) => {
  switch (action.type) {
    case LOADING_STATUS:
      if (state.loading[action.payload.type]) {
        return state
      }
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.namespace
        }
      }
    case ERROR_STATUS:
      return {
        ...state,
        error: action.payload.message
      }
    case WARNING_STATUS:
      return {
        ...state,
        warning: action.payload.message
      }
    case CLOSE_STATUS:
    case LOCATION_CHANGE:
      return {
        ...initState
      }
    default:
      if (state.loading[action.type]) {
        return {
          ...state,
          loading: Object.keys(state.loading).filter(a => a !== action.type).reduce((prev, curr) => ({
            ...prev,
            [curr]: state.loading[curr]
          }), {})
        }
      }
      return state
  }
}
