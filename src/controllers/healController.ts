import { NextFunction, Request, Response } from 'express';
import { HpModifyInfo, validateRequest } from '../shared/validator';
import { PlayerHpService } from '../services/playerHpService';
import { PlayerNotFoundError } from '../shared/playerNotFoundError';

const playerHpService = PlayerHpService.getInstance();

/**
 * @swagger
 * /heal:
 *   post:
 *     summary: Heal the player
 *     tags: [Heal]
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
 *     responses:
 *       200:
 *         description: The current HP of the player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentHp:
 *                   type: number
 *                   example: 25
 *       400:
 *         description: Invalid amount
 *       404:
 *         description: Player not found
 */
export const heal = async (req: Request, res: Response, next: NextFunction) => {
    const healInfo = new HpModifyInfo();
    healInfo.playerName = req.body.playerName;
    healInfo.amount = req.body.amount;
    const errors = await validateRequest(healInfo);
    if (errors) {
        res.status(400).json({
            message: 'Invalid request body.',
            Errors: errors,
        });
        return;
    }
    try {
        const result = await playerHpService.healPlayer(healInfo);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof PlayerNotFoundError) {
            res.status(404).send(error.message);
            return;
        }
        next(error);
    }
};
