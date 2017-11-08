import { Router } from 'express'
import jwt from 'jsonwebtoken'

import config from '../config'
import { passport, samlStrategy } from '../config/passport'

const router = Router()

const jwtConfig = config.get('auth:jwt')
const samlConfig = config.get('auth:saml')

function sign (payload) {
  return jwt.sign(
    payload,
    jwtConfig.secret,
    { algorithm: 'RS256' }
  )
}

router.route('/auth/login')
  .get(
    passport.authenticate('saml', { failureRedirect: '/auth/login/fail' }),
    (req, res, next) => {
      const token = sign(req.user.dataValues)
      res
        .cookie('_token_v1', token)
        .redirect(samlConfig.finalUrl)
    })

router.route('/auth/login/callback')
  .post(
    passport.authenticate('saml', { failureRedirect: '/auth/login/fail' }),
    (req, res) => {
      const token = sign(req.user.dataValues)
      res
        .cookie('_token_v1', token)
        .redirect(samlConfig.finalUrl)
    })

router.route('/auth/login/fail')
  .get((req, res) => {
    res.status(401).send('Login failed')
  })

router.route('/Shibboleth.sso/Metadata')
  .get((req, res) => {
    res.type('application/xml')
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(samlConfig.publicCert))
  })

export default router
