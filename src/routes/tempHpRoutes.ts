import { Router } from 'express';
import { addTempHp } from '../controllers/tempHpController';

const router = Router();

router.post('/', addTempHp);

export default router;
