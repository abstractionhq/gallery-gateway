import { Router } from 'express'
import auth from './auth'
import upload from './upload'
import download from './download'

const router = Router()

router.use(auth)
router.use(upload)
router.use(download)

export default router
