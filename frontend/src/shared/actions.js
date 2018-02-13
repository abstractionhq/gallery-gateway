import jwt from 'jsonwebtoken'
import { push } from 'connected-react-router'

export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const JUDGE_ROLE = 'JUDGE_ROLE'
export const ADMIN_ROLE = 'ADMIN_ROLE'

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
    type: JUDGE_ROLE
  })
}

export const switchToAdmin = () => (dispatch, getState, client) => {
  dispatch({
    type: ADMIN_ROLE
  })
}
