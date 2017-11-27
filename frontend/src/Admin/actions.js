import Promise from 'bluebird'

import ShowsQuery from './queries/shows.graphql'
import JudgesQuery from './queries/judges.graphql'
import JudgesForShowQuery from './queries/judgesForShow.graphql'

export const LOADING_DATA = 'LOADING_DATA'
export const FETCH_SHOWS = 'FETCH_SHOWS'
export const FETCH_JUDGES = 'FETCH_JUDGES'
export const FETCH_JUDGES_FOR_SHOW = 'FETCH_JUDGES_FOR_SHOW'
export const FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW = 'FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW'

export const fetchShows = () => (dispatch, getState, client) => {
  return client.query({query: ShowsQuery})
    .then(({data}) => dispatch({type: FETCH_SHOWS, payload: data}))
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
    .then(({data}) => dispatch({type: FETCH_JUDGES_FOR_SHOW, payload: data}))
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
      dispatch(fetchJudges())
    ])
    .spread(({data: {judges: {judges}}, loading}) => {
      if (loading) {
        dispatch({
          type: LOADING_DATA,
          payload: {}
        })
      } else {
        dispatch({
          type: FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW,
          payload: Object.keys(judges),
          showId
        })
      }
    })
    .catch(console.error) // TODO: Handle the error
}
