import { Router } from 'express'
import auth from './auth'
import upload from './upload'

const router = Router()

router.use(auth)
router.use(upload)

export default router
