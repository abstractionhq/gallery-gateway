import jwt from 'jsonwebtoken';
import nconf from '../config';

export default function (req, res, next) {
  jwt.verify(req.cookies['token'], nconf.get('auth:jwt:pub'), { algorithm: 'RS256' }, (err, decoded) => { // eslint-disable-line handle-callback-err
    req.auth = decoded;
    next();
  });
}