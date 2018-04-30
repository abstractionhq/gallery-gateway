import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { maskErrors } from 'graphql-errors'

import config from './config'
import { passport } from './config/passport'
import models from './models'
import router from './routes'
import schema from './schema'
import parseJwtUser from './middleware/parseJwtUser'

const app = express()

// Setup Model Associations
models()

// Disable 'X-Powered-By' Header (See: https://expressjs.com/en/advanced/best-practice-security.html)
app.disable('x-powered-by')

// When not in production, accept requests from any origin since we'll
// be running the frontend and backend on separate ports. In production,
// we use nginx to serve them at the same origin, so CORS is not necessary.
if (config.get('NODE_ENV') !== 'production') {
  app.use(cors())
}

app.use(bodyParser.json()) // Parse application/json
app.use(bodyParser.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded

// Initialize Passport - for SAML Auth
app.use(passport.initialize())

// Add JWT parsing middleware
app.use(parseJwtUser)

// Setup Routes
app.use(router)

// Don't expose GraphQL Internal Errors to the Client
maskErrors(schema)
// Setup GraphQL endpoint
app.use('/graphql', graphqlExpress(req => ({
  schema,
  context: req
})))

// Setup GraphiQL web interface in development
if (config.get('NODE_ENV') !== 'production') {
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}

// Setup static asset serving
app.use('/static/uploads', express.static(path.join(__dirname, 'uploads', 'images')))
app.use('/static/uploads', express.static(path.join(__dirname, 'uploads', 'pdfs')))

export default app
