import { Router } from 'express'
import auth from './auth'

const router = Router()

router.use(auth)

export default router
