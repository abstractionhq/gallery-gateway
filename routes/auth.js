import { Router } from 'express';
import jwt from 'jsonwebtoken';
import nconf from '../config';
import passport from 'passport';
import saml from 'passport-saml';
import verifyUser from '../middleware/verifyUser';
import bodyParser from 'body-parser';
import User from '../models/user';
import { STUDENT } from '../permissionLevels'


const router = Router(); // eslint-disable-line new-cap

const jwtConfig = nconf.get('auth:jwt');

function sign(payload) {
    return {
      token: jwt.sign(
        payload,
        jwtConfig.secret,
        { expiresInMinutes: jwtConfig.expiresInMinutes, algorithm: 'RS256' }
      ),
    };
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const samlConfig = nconf.get('auth:saml');

const samlStrategy = new saml.Strategy({
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
}, function(profile, done) {
  // We've received login success, we need to look up the user
  const email = profile.email || '';
  const user = email.replace('@example.com', '');
  if (!user) {
    return done('No user property found', null);
  }
  return done(null, User
    .findOrCreate({
      where: { username: user },
      defaults: {
        firstName: 'unknown',
        lastName: 'unknown',
        type: STUDENT
      }
    })
    .spread((user, created) => {
      return Promise.all([user.save(), created]);
    }));
});

passport.use(samlStrategy);

router
  .route('/login')
    .get(
      passport.initialize(),
      passport.authenticate('saml', { failureRedirect: '/auth/login/fail' }),
      (req, res, next) => {
        res.redirect('/')
      });

router
  .route('/login/callback')
    .post(
      passport.initialize(),
      bodyParser.urlencoded({ extended: true }),
      passport.authenticate('saml', { failureRedirect: '/login/fail' }),
      (req, res) => {
        res.redirect(samlConfig.finalUrl);
      });

router
  .route('/login/fail')
    .get((req, res) => {
      res.status(401).send('Login failed');
    });


router
  .route('/Shibboleth.sso/Metadata')
    .get((req, res) => {
      res.type('application/xml');
      res.status(200).send(samlStrategy.generateServiceProviderMetadata(samlConfig.publicCert));
    });

export default router;