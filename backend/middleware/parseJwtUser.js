import { parseToken } from '../helpers/jwt'
import nconf from '../config'
import { ADMIN } from '../constants'

export default function (req, res, next) {
  if (req.headers.authorization &&
      req.headers.authorization.indexOf('Bearer ') === 0) {
    const token = req.headers.authorization.substr('Bearer '.length)
    parseToken(token, (err, decoded) => {
      if (!err) {
        req.auth = decoded
      }
    })
  }
  req.auth = req.auth || {}
  req.auth.type = req.auth.type || null
  if (nconf.get('NODE_ENV') === 'development' &&
      req.headers.referer &&
      req.headers.referer.indexOf('http://localhost:3000/graphiql') === 0) {
    req.auth.type = ADMIN
  }
  next()
}
