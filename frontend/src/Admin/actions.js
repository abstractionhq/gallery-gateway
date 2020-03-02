import ShowQuery from './queries/show.graphql'
import PortfolioQuery from './queries/portfolioPeriod.graphql'
import ShowsQuery from './queries/shows.graphql'
import PortfoliosQuery from './queries/portfolioPeriods.graphql'
import AdminsQuery from './queries/admins.graphql'
import JudgesQuery from './queries/judges.graphql'
import JudgesForShowQuery from './queries/judgesForShow.graphql'
import JudgesForPortfolioPeriodQuery from './queries/judgesForPortfolioPeriod.graphql'
import { displayError } from '../shared/actions'
import { ZIP_PATH, CSV_PATH } from '../utils'

export const LOADING_DATA = 'LOADING_DATA'
export const FETCH_SHOW = 'FETCH_SHOW'
export const FETCH_SHOWS = 'FETCH_SHOWS'
export const FETCH_ADMINS = 'FETCH_ADMINS'
export const FETCH_JUDGES = 'FETCH_JUDGES'
export const FETCH_JUDGES_FOR_SHOW = 'FETCH_JUDGES_FOR_SHOW'
export const FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW =
  'FETCH_JUDGES_BY_ASSIGNMENT_FOR_SHOW'
export const ASSIGN_JUDGES_TO_SHOW = 'ASSIGN_JUDGES_TO_SHOW'
export const REMOVE_JUDGES_FROM_SHOW = 'REMOVE_JUDGES_FROM_SHOW'
export const ASSIGN_JUDGES_TO_PORTFOLIO_PERIOD = 'ASSIGN_JUDGES_TO_PORTFOLIO_PERIOD'
export const REMOVE_JUDGES_FROM_PORTFOLIO_PERIOD = 'REMOVE_JUDGES_FROM_PORTFOLIO_PERIOD'
export const ADD_ADMIN = 'ADD_ADMIN'
export const ADD_JUDGE = 'ADD_JUDGE'
export const FETCH_PORTFOLIO_PERIOD = "FETCH_PORTFOLIO_PERIOD"
export const FETCH_PORTFOLIO_PERIODS = "FETCH_PORTFOLIO_PERIODS"
export const FETCH_JUDGES_BY_ASSIGNMENT_FOR_PORTFOLIO_PERIOD =
  'FETCH_JUDGES_BY_ASSIGNMENT_FOR_PORTFOLIO_PERIOD'

export const fetchShow = showId => (dispatch, getState, client) => {
  return client
    .query({
      query: ShowQuery,
      variables: {
        id: showId
      }
    }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { show } }) => dispatch({ type: FETCH_SHOW, payload: show }))
    .catch(err => dispatch(displayError(err.message)))
}


export const fetchPortfolioPeriod = portfolioPeriodId => (dispatch, getState, client) => {
  return client
    .query({
      query: PortfolioQuery,
      variables: {
        id: portfolioPeriodId
      }
    }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { portfolioPeriod } }) => dispatch({ type: FETCH_PORTFOLIO_PERIOD, payload: portfolioPeriod }))
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchShows = () => (dispatch, getState, client) => {
  return client
    .query({ query: ShowsQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { shows } }) =>
      dispatch({ type: FETCH_SHOWS, payload: shows })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchPortfolioPeriods = () => (dispatch, getState, client) => {
  return client
    .query({ query: PortfoliosQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { portfolioPeriods } }) => dispatch({ type: FETCH_PORTFOLIO_PERIODS, payload: portfolioPeriods }))
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchAdmins = () => (dispatch, getState, client) => {
  return client
    .query({ query: AdminsQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { admins } }) =>
      dispatch({ type: FETCH_ADMINS, payload: admins })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchJudges = () => (dispatch, getState, client) => {
  return client
    .query({ query: JudgesQuery }) // TODO: Dispatch loading action & loading finished action
    .then(({ data: { judges } }) =>
      dispatch({ type: FETCH_JUDGES, payload: judges })
    )
    .catch(err => dispatch(displayError(err.message)))
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
    .catch(err => dispatch(displayError(err.message)))
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
    .then(([{ data: { show }, loading }]) => {
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
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchJudgesByAssignmentForPortfolioPeriod = portfolioPeriodId => (
  dispatch,
  getState,
  client
) => {
  return Promise.all([
    client.query({
      query: JudgesForPortfolioPeriodQuery,
      variables: {
        id: portfolioPeriodId
      }
    }),
    dispatch(fetchPortfolioPeriods()),
    dispatch(fetchJudges())
  ])
    .then(([{ data: { portfolioPeriod }, loading }]) => {
      if (loading) {
        dispatch({
          type: LOADING_DATA, // TODO: Do something w/ this
          payload: {}
        })
      } else {
        dispatch({
          type: FETCH_JUDGES_BY_ASSIGNMENT_FOR_PORTFOLIO_PERIOD,
          payload: portfolioPeriod
        })
      }
    })
    .catch(err => dispatch(displayError(err.message)))
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

export const assignJudgesToPortfolioPeriod = (portfolioPeriodId, usernames) => (
  dispatch,
  getState,
  client
) => {
  dispatch({
    type: ASSIGN_JUDGES_TO_PORTFOLIO_PERIOD,
    payload: {
      id: portfolioPeriodId,
      usernames
    }
  })
}

export const removeJudgesFromPortfolioPeriod = (portfolioPeriodId, usernames) => (
  dispatch,
  getState,
  client
) => {
  dispatch({
    type: REMOVE_JUDGES_FROM_PORTFOLIO_PERIOD,
    payload: {
      id: portfolioPeriodId,
      usernames
    }
  })
}

export const addAdmin = admin => (dispatch, getState, client) => {
  dispatch({
    type: ADD_ADMIN,
    payload: admin
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
