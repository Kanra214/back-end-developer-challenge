import { Router } from 'express';
import { dealDamage } from '../controllers/damageController';

const router = Router();

router.post('/', dealDamage);

export default router;
