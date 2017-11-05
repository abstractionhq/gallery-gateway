import passport from 'passport'
import saml from 'passport-saml'

import config from './index'
import User from '../models/user'
import { STUDENT } from '../permissionLevels'

const samlConfig = config.get('auth:saml')

export const samlStrategy = new saml.Strategy({
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: samlConfig.callbackUrl,
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: samlConfig.entryPoint,
  // Usually specified as `/shibboleth` from site root
  issuer: samlConfig.issuer,
  identifierFormat: null,
  // Service Provider private key
  decryptionPvk: samlConfig.decryptionPvk,
  // Service Provider Certificate
  privateCert: samlConfig.privateCert,
  // Identity Provider's public key
  cert: samlConfig.cert,
  validateInResponseTo: false,
  disableRequestedAuthnContext: true
}, function (profile, done) {
  // We've received login success, we need to look up the user
  const email = profile.email || ''
  const user = email.replace('@example.com', '')
  if (!user) {
    return done('No user property found', null)
  }

  User
    .findOrCreate({
      where: { username: user },
      defaults: {
        firstName: 'Unknown',
        lastName: 'Unknown',
        type: STUDENT
      }
    })
    .spread((user, created) => {
      return Promise.all([user.save(), created])
    })
    .then((thing) => done(null, thing[0]))
})

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(samlStrategy)

export { passport }
