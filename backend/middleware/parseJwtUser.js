import jwt from 'jsonwebtoken';
import nconf from '../config';
import { ADMIN, JUDGE, STUDENT } from '../permissionLevels'


export default function (req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.substr(7);
    jwt.verify(
      token,
      nconf.get('auth:jwt:pub'),
      { algorithm: 'RS256' },
      (err, decoded) => {
        if (!err) {
          req.auth = decoded;
        }
    });
  }
  req.auth = req.auth || {};
  req.auth.type = req.auth.type || null;
  next();
}
