import jwt from 'jsonwebtoken'
import { push } from 'connected-react-router'

export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

export const loginUser = (token) => (dispatch, getState, client) => {
  const user = jwt.decode(token)
  dispatch({
    type: LOGIN_USER,
    payload: {
      user,
      token
    }
  })
}

export const logoutUser = () => (dispatch, getState, client) => {
  dispatch({
    type: LOGOUT_USER
  })
  dispatch(push('/'))
}
