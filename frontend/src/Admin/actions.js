import Promise from 'bluebird'

import ShowsQuery from './queries/shows.graphql'
import JudgesQuery from './queries/judges.graphql'
import JudgesForShowQuery from './queries/judgesForShow.graphql'

export const LOADING_DATA = 'LOADING_DATA'
export const FETCH_SHOWS = 'FETCH_SHOWS'
export const FETCH_JUDGES = 'FETCH_JUDGES'
export const FETCH_JUDGES_FOR_SHOW = 'FETCH_JUDGES_FOR_SHOW'
export const FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW = 'FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW'
export const ASSIGN_JUDGES_TO_SHOW = 'ASSIGN_JUDGES_TO_SHOW'
export const REMOVE_JUDGES_FROM_SHOW = 'REMOVE_JUDGES_FROM_SHOW'

export const fetchShows = () => (dispatch, getState, client) => {
  return client.query({query: ShowsQuery})
    .then(({data: {shows}}) => dispatch({type: FETCH_SHOWS, payload: shows}))
    .catch(console.error) // TODO: Handle the error
}

export const fetchJudges = () => (dispatch, getState, client) => {
  return client.query({query: JudgesQuery})
    .then(({data: {judges}}) => dispatch({type: FETCH_JUDGES, payload: judges}))
    .catch(console.error) // TODO: Handle the error
}

export const fetchJudgesForShow = (showId) => (dispatch, getState, client) => {
  return client.query({
    query: JudgesForShowQuery,
    variables: {
      id: showId
    }
  })
    .then(({data: {show}}) => dispatch({type: FETCH_JUDGES_FOR_SHOW, payload: show}))
    .catch(console.error) // TODO: Handle the error
}

export const feetchJudgesByAssignmentForShow = (showId) => (dispatch, getState, client) => {
  return Promise
    .all([
      client.query({
        query: JudgesForShowQuery,
        variables: {
          id: showId
        }
      }),
      dispatch(fetchShows()),
      dispatch(fetchJudges())
    ])
    .spread(({data: {show}, loading}) => {
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
    .catch(console.error) // TODO: Handle the error
}

export const assignJudgesToShow = (showId, usernames) => (dispatch, getState, client) => {
  dispatch({
    type: ASSIGN_JUDGES_TO_SHOW,
    payload: {
      id: showId,
      usernames
    }
  })
}

export const removeJudgesFromShow = (showId, usernames) => (dispatch, getState, client) => {
  dispatch({
    type: REMOVE_JUDGES_FROM_SHOW,
    payload: {
      id: showId,
      usernames
    }
  })
}
