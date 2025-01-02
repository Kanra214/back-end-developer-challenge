import { NextFunction, Request, Response } from 'express';
import { DamageInfo, validateRequest } from '../shared/validator';
import { PlayerNotFoundError } from '../shared/playerNotFoundError';
import { PlayerHpService } from '../services/playerHpService';

const playerHpService = PlayerHpService.getInstance();

/**
 * @swagger
 * /dealDamage:
 *   post:
 *     summary: Deal damage to the player
 *     tags: [Damage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerName
 *               - amount
 *               - damageType
 *             properties:
 *               playerName:
 *                 type: string
 *                 example: "Briv"
 *               amount:
 *                 type: number
 *                 oneof:
 *                  - minimum: 0
 *                 example: 10
 *               damageType:
 *                 type: string
 *                 enum: [BLUDGEONING, PIERCING, SLASHING, FIRE, COLD, ACID, THUNDER, LIGHTNING, POISON, RADIANT, NECROTIC, PSYCHIC, FORCE]
 *                 example: "FIRE"
 *     responses:
 *       200:
 *         description: The current HP and the temp HP of the player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentHp:
 *                   type: number
 *                   example: 15
 *                 tempHp:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Invalid damage type or amount
 *       404:
 *         description: Player not found
 */
export const dealDamage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const damageInfo = new DamageInfo();
    damageInfo.playerName = req.body.playerName;
    damageInfo.amount = req.body.amount;
    damageInfo.damageType = req.body.damageType;
    const errors = await validateRequest(damageInfo);
    if (errors) {
        res.status(400).json({
            message: 'Invalid request body.',
            Errors: errors,
        });
        return;
    }

    try {
        const result = await playerHpService.dealDamage(damageInfo);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof PlayerNotFoundError) {
            res.status(404).send(error.message);
            return;
        }
        next(error);
    }
};
