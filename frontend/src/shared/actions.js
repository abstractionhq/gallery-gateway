import axios from 'axios'
import jwt from 'jsonwebtoken'
import { push } from 'connected-react-router'

import { DOWNLOAD_TOKEN_PATH } from '../utils'

export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SWITCH_TO_JUDGE = 'SWITCH_TO_JUDGE'
export const SWITCH_TO_ADMIN = 'SWITCH_TO_ADMIN'
export const GET_DOWNLOAD_TOKEN = 'GET_DOWNLOAD_TOKEN'

export const shouldLogin = () => {
  return !!window.localStorage.getItem('_token_v1')
}

export const login = () => (dispatch, getState, client) => {
  const token = window.localStorage.getItem('_token_v1')
  const user = jwt.decode(token)
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

  return axios.post(DOWNLOAD_TOKEN_PATH, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      dispatch({
        type: GET_DOWNLOAD_TOKEN,
        payload: res.data.token
      })
    }) // TODO handle errors
}
