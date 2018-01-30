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
import { imageUploader, pdfUploader } from './upload'
import { allowedToSubmit } from './helpers/submission'
import { ADMIN, STUDENT } from './constants'

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

function uploadAuth(req, res, next) {
  const authType = req.auth.type
  if (authType !== ADMIN && authType !== STUDENT) { 
    return res.status(401).send('Permission Denied')
  } else {
    next()
  }

}
app.use('/static', express.static(path.join(__dirname, 'images')))

router.post('/static/upload/image', uploadAuth, imageUploader) 
router.post('/static/upload/pdf', uploadAuth, pdfUploader)

export default app // for testing
