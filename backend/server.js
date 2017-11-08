import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import graphqlHttp from 'express-graphql'
import jwt from 'express-jwt'
import { maskErrors } from 'graphql-errors'
import cors from 'cors'

import config from './config'
import models from './models'
import router from './routes'
import schema from './schema'

const app = express()
models()

// For PROD: Don't uncomment until schema is more solid
// app.use(jwt({
//     secret: nconf.get('auth:jwt:pub'),
//     requestProperty: 'auth',
//     algorithms: ['RS256', 'RS384', 'RS512'],
// }));

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(router)

maskErrors(schema)
app.use('/graphql', graphqlHttp(req => ({
  schema,
  graphiql: config.get('NODE_ENV') !== 'production',
  context: req
})))

export default app // for testing
