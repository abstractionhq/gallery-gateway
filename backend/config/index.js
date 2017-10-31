import nconf from 'nconf';
import database from './database';
import auth from './auth';

nconf
    .argv()
    .env()
    .use('memory');

nconf.set('auth', auth);
nconf.set('db', database);
nconf.set('api:prefix', 'api');
nconf.set('api:version', 'v1');

nconf.defaults({
    NODE_ENV: 'development',
});

export default nconf;