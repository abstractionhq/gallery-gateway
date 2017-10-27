import nconf from 'nconf';
import sequelize from './sequelize';
import auth from './auth';

nconf
    .argv()
    .env()
    .use('memory');

nconf.set('auth', auth);
nconf.set('db', sequelize);
nconf.set('api:prefix', 'api');
nconf.set('api:version', 'v1');

export default nconf;