import Promise from 'bluebird'

import ShowQuery from './queries/show.graphql'
import ShowsQuery from './queries/shows.graphql'
import JudgesQuery from './queries/judges.graphql'
import JudgesForShowQuery from './queries/judgesForShow.graphql'
import { displayError } from '../shared/actions'
import { ZIP_PATH, CSV_PATH } from '../utils'

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

export const fetchShow = showId => (dispatch, getState, client) => {
  return client
    .query({
      query: ShowQuery,
      variables: {
        id: showId
      }
    }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { show } }) => dispatch({ type: FETCH_SHOW, payload: show }))
    .catch((err) => dispatch(displayError(err.message)))
}

export const fetchShows = () => (dispatch, getState, client) => {
  return client
    .query({ query: ShowsQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { shows } }) => dispatch({ type: FETCH_SHOWS, payload: shows }))
    .catch((err) => dispatch(displayError(err.message)))
}

export const fetchJudges = () => (dispatch, getState, client) => {
  return client
    .query({ query: JudgesQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { judges } }) => dispatch({ type: FETCH_JUDGES, payload: judges }))
    .catch((err) => dispatch(displayError(err.message)))
}

export const fetchJudgesForShow = showId => (dispatch, getState, client) => {
  return client
    .query({
      query: JudgesForShowQuery,
      variables: {
        id: showId
      }
    }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { show } }) =>
      dispatch({ type: FETCH_JUDGES_FOR_SHOW, payload: show })
    )
    .catch((err) => dispatch(displayError(err.message)))
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
          type: LOADING_DATA, // TODO: Do something w/ this
          payload: {}
        })
      } else {
        dispatch({
          type: FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW,
          payload: show
        })
      }
    })
    .catch((err) => dispatch(displayError(err.message)))
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

export const downloadZip = showId => (dispatch, getState, client) => {
  const { shared: { auth: { downloadToken } } } = getState()

  window.open(
    `${ZIP_PATH}${showId}?token=${encodeURIComponent(downloadToken)}`,
    '_self'
  )
}

export const downloadCsv = showId => (dispatch, getState, client) => {
  const { shared: { auth: { downloadToken } } } = getState()

  window.open(
    `${CSV_PATH}${showId}?token=${encodeURIComponent(downloadToken)}`,
    '_self'
  )
}
