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
import imageUploader from './upload'

const app = express()

models()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(parseJwtUser)
app.use(router)

maskErrors(schema)
app.use('/graphql', graphqlExpress(req => ({
  schema,
  context: req
})))

if (config.get('NODE_ENV') !== 'production') {
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}

app.use('/static', express.static(path.join(__dirname, 'images')))
router.post('/static/upload', imageUploader) // TODO: Require Authentication

export default app // for testing
