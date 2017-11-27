import bodyParser from 'body-parser'
import express from 'express'
import graphqlHttp from 'express-graphql'
import { maskErrors } from 'graphql-errors'
import cors from 'cors'

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
app.use('/graphql', graphqlHttp(req => ({
  schema,
  graphiql: config.get('NODE_ENV') !== 'production',
  context: req
})))

router.post('/upload', imageUploader)

export default app // for testing
