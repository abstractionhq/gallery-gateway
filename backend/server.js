import express from 'express';
import graphqlHttp from 'express-graphql';
import models from './models';
import router from './routes';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import schema from './schema';

const app = express();
models();

// For PROD: Don't uncomment until schema is more solid
// app.use(jwt({
//     secret: nconf.get('auth:jwt:pub'),
//     requestProperty: 'auth',
//     algorithms: ['RS256', 'RS384', 'RS512'],
// }));

app.use(bodyParser.json());
app.use(cookieParser())
app.use(router);

app.use('/graphql', graphqlHttp(req => ({
    schema,
    graphiql: true,
    context: req,
})));

const port = process.env.PORT || 3000;
console.log('Listening on port ' + port);
app.listen(port);