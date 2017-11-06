import nconf from '../config'
import jwt from 'jsonwebtoken'

function sign (payload) {
  return jwt.sign(
    payload,
    nconf.get('auth:jwt:secret'),
    { algorithm: 'RS256' }
  )
}

/**
 * Generates and signs a token for the given user
 * @param {User} user
 * @return {string} the token
 */
export function signUserToken(user) {
  return sign(user.dataValues);
}
