import jwt from 'jsonwebtoken'
import config from '../config'

const jwtConfig = config.get('auth:jwt')

export function parseToken (token, callback) {
  jwt.verify(
    token,
    jwtConfig.pub,
    { algorithm: 'RS256' },
    callback
  )
}

export function signToken (payload, opts = {}) {
  opts.expiresIn = opts.expiresIn || (jwtConfig.expiresInMinutes * 60000)
  return jwt.sign(
    payload,
    jwtConfig.secret,
    {
      algorithm: 'RS256',
      expiresIn: opts.expiresIn
    }
  )
}
