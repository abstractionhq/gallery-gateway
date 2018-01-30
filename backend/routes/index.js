import { Router } from 'express'
import auth from './auth'
import download from './download'

const router = Router()

router.use(auth)
router.use(download)

export default router
