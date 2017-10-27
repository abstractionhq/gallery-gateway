import { Router } from 'express';
import auth from './auth';
import nconf from '../config';

const router = Router();

const apiConfig = nconf.get('api');
const apiPath = `/${apiConfig.prefix}/${apiConfig.version}`;

router.use('/auth', auth);

export default router;