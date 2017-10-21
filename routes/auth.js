import { Router } from 'express';
import jwt from 'jsonwebtoken';
import nconf from '../config';
import provider from '../googleProvider';
import verifyUser from '../middleware/verifyUser';

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

router
.route('/')
  .get(verifyUser, (req, res, next) => {
    if (req.auth) {
      return res.send({
        firstName: req.auth.user.firstName,
        lastName: req.auth.user.lastName,
        dce: req.auth.user.dce,
      });
    }
    return next({ message: 'not logged in', status: 401 });
  });

router
.route('/login')
  .post((req, res, next) => {
    // Add refresh tokens

    const google = new provider(
      req.body.secret,
      req.body.id
    );

    provider
      .verify()
      .then(() => provider.findOrCreateUser())
      .then(user => res.send(sign({
        user: user[0],
      })))
      .catch((err) => {
        err.status = 401;
        next(err);
      });
  });

  export default router;