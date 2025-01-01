import { Router } from 'express';
import { heal } from '../controllers/healController';

const router = Router();

router.post('/', heal);

export default router;
