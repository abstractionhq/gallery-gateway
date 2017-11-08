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

/**
 * Decodes a token and returns it
 * @param {string} token the jwt token
 * @return {object} decoded token
 */
export function decodeUserToken(token) {
  var decoded = {};
  jwt.verify(
    token,
    nconf.get('auth:jwt:pub'),
    { algorithm: 'RS256' },
    (err, decoded_) => {
      if (!err) {
        decoded = decoded_;
      }
  });
  return decoded
}