import { Router } from 'express'

import config from '../config'
import { signToken } from '../helpers/jwt'
import { passport, samlStrategy } from '../config/passport'

const router = Router()

const jwtConfig = config.get('auth:jwt')
const samlConfig = config.get('auth:saml')

router.route('/auth/login')
  .get(
    passport.authenticate('saml', { failureRedirect: '/auth/login/fail' }),
    (req, res, next) => {
      const token = signToken(req.user.dataValues)
      res
        .cookie('_token_v1', token)
        .redirect(samlConfig.finalUrl)
    })

router.route('/auth/login/callback')
  .post(
    passport.authenticate('saml', { failureRedirect: '/auth/login/fail' }),
    (req, res) => {
      const token = signToken(req.user.dataValues)
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

router.route('/auth/downloadToken')
  .post((req, res) => {
    if (!req.auth || !req.auth.username || !req.auth.type) {
      return res
        .status(401)
        .type('json')
        .send({error: 'no authentication provided'})
    }
    const expiryInMillis = jwtConfig.downloadTokenExpiresInMinutes * 60000
    const token = signToken(
      {username: req.auth.username, type: req.auth.type},
      {expiresIn: expiryInMillis}
    )
    res
      .type('application/json')
      .send({token: token})
  })

export default router
