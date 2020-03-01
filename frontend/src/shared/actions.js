import axios from 'axios'
import decodeJWT from 'jwt-decode'
import { push } from 'connected-react-router'

import { DOWNLOAD_TOKEN_PATH } from '../utils'

export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SWITCH_TO_JUDGE = 'SWITCH_TO_JUDGE'
export const SWITCH_TO_ADMIN = 'SWITCH_TO_ADMIN'
export const GET_DOWNLOAD_TOKEN = 'GET_DOWNLOAD_TOKEN'
export const DISPLAY_ERROR = 'DISPLAY_ERROR'
export const DISMISS_ERROR = 'DISMISS_ERROR'
export const SET_USER_HOMETOWN = 'SET_USER_HOMETOWN'
export const SET_USER_DISPLAY_NAME = 'SET_USER_DISPLAY_NAME'

export const shouldLogin = () => {
  return !!window.localStorage.getItem('_token_v1')
}

export const login = () => (dispatch, getState, client) => {
  const token = window.localStorage.getItem('_token_v1')
  const user = decodeJWT(token)
  dispatch({
    type: LOGIN_USER,
    payload: {
      user,
      token
    }
  })
}

export const logout = () => (dispatch, getState, client) => {
  dispatch({
    type: LOGOUT_USER
  })
  window.localStorage.removeItem('_token_v1')
  dispatch(push('/'))
}

export const switchToJudge = () => (dispatch, getState, client) => {
  dispatch({
    type: SWITCH_TO_JUDGE
  })
}

export const switchToAdmin = () => (dispatch, getState, client) => {
  dispatch({
    type: SWITCH_TO_ADMIN
  })
}

export const getDownloadToken = () => (dispatch, getState, client) => {
  const { shared: { auth: { token } } } = getState()

  return axios
    .post(DOWNLOAD_TOKEN_PATH, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      dispatch({
        type: GET_DOWNLOAD_TOKEN,
        payload: res.data.token
      })
    })
    .catch(err => dispatch(displayError(err.message)))
}

export const displayError = message => (dispatch, getState, client) => {
  dispatch({
    type: DISPLAY_ERROR,
    payload: message
  })
}

export const dismissError = index => (dispatch, getState, client) => {
  dispatch({
    type: DISMISS_ERROR,
    payload: index
  })
}

export const setUserHometown = hometown => (dispatch, getState, client) => {
  dispatch({
    type: SET_USER_HOMETOWN,
    payload: hometown
  })
}
  export const setUserDisplayName = displayName => (dispatch, getState, client) => {
    dispatch({
      type: SET_USER_DISPLAY_NAME,
      payload: displayName
    })
}