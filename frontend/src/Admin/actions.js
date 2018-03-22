import Promise from 'bluebird'

import ShowQuery from './queries/show.graphql'
import ShowsQuery from './queries/shows.graphql'
import JudgesQuery from './queries/judges.graphql'
import JudgesForShowQuery from './queries/judgesForShow.graphql'

export const LOADING_DATA = 'LOADING_DATA'
export const FETCH_SHOW = 'FETCH_SHOW'
export const FETCH_SHOWS = 'FETCH_SHOWS'
export const FETCH_JUDGES = 'FETCH_JUDGES'
export const FETCH_JUDGES_FOR_SHOW = 'FETCH_JUDGES_FOR_SHOW'
export const FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW =
  'FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW'
export const ASSIGN_JUDGES_TO_SHOW = 'ASSIGN_JUDGES_TO_SHOW'
export const REMOVE_JUDGES_FROM_SHOW = 'REMOVE_JUDGES_FROM_SHOW'
export const ADD_JUDGE = 'ADD_JUDGE'
export const DISPLAY_ERROR = 'DISPLAY_ERROR'
export const DISMISS_ERROR = 'DISMISS_ERROR'

export const fetchShow = showId => (dispatch, getState, client) => {
  return client
    .query({
      query: ShowQuery,
      variables: {
        id: showId
      }
    })
    .then(({ data: { show } }) => dispatch({ type: FETCH_SHOW, payload: show }))
    .catch((message) => {
      dispatch({type: DISPLAY_ERROR, message})
    })
}

export const fetchShows = () => (dispatch, getState, client) => {
  return client
    .query({ query: ShowsQuery })
    .then(({ data: { shows } }) =>
      dispatch({ type: FETCH_SHOWS, payload: shows })
    )
    .catch((message) => {
      dispatch({type: DISPLAY_ERROR, message})
    })
}

export const fetchJudges = () => (dispatch, getState, client) => {
  return client
    .query({ query: JudgesQuery })
    .then(({ data: { judges } }) =>
      dispatch({ type: FETCH_JUDGES, payload: judges })
    )
    .catch((message) => {
      dispatch({type: DISPLAY_ERROR, message})
    })
}

export const fetchJudgesForShow = showId => (dispatch, getState, client) => {
  return client
    .query({
      query: JudgesForShowQuery,
      variables: {
        id: showId
      }
    })
    .then(({ data: { show } }) =>
      dispatch({ type: FETCH_JUDGES_FOR_SHOW, payload: show })
    )
    .catch((message) => {
      dispatch({type: DISPLAY_ERROR, message})
    })
}

export const fetchJudgesByAssignmentForShow = showId => (
  dispatch,
  getState,
  client
) => {
  return Promise.all([
    client.query({
      query: JudgesForShowQuery,
      variables: {
        id: showId
      }
    }),
    dispatch(fetchShows()),
    dispatch(fetchJudges())
  ])
    .spread(({ data: { show }, loading }) => {
      if (loading) {
        dispatch({
          type: LOADING_DATA,
          payload: {}
        })
      } else {
        dispatch({
          type: FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW,
          payload: show
        })
      }
    })
    .catch((message) => {
      dispatch({type: DISPLAY_ERROR, message})
    })
}

export const assignJudgesToShow = (showId, usernames) => (
  dispatch,
  getState,
  client
) => {
  dispatch({
    type: ASSIGN_JUDGES_TO_SHOW,
    payload: {
      id: showId,
      usernames
    }
  })
}

export const removeJudgesFromShow = (showId, usernames) => (
  dispatch,
  getState,
  client
) => {
  dispatch({
    type: REMOVE_JUDGES_FROM_SHOW,
    payload: {
      id: showId,
      usernames
    }
  })
}

export const addJudge = judge => (dispatch, getState, client) => {
  dispatch({
    type: ADD_JUDGE,
    payload: judge
  })
}

export const displayError = (message) => dispatch => {
  dispatch({
    type: DISPLAY_ERROR,
    message: message
  })
}

export const dismissError = () => dispatch => {
  dispatch({
    type: DISMISS_ERROR
  })
}
