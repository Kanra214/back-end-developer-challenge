import { NextFunction, Request, Response } from 'express';
import { HpModifyInfo, validateRequest } from '../shared/validator';
import { PlayerHpService } from '../services/playerHpService';
import { PlayerNotFoundError } from '../shared/playerNotFoundError';

const playerHpService = PlayerHpService.getInstance();

/**
 * @swagger
 * /addTempHp:
 *   post:
 *     summary: Add temporary HP to the player
 *     tags: [Temporary HP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerName
 *               - amount
 *             properties:
 *               playerName:
 *                 type: string
 *                 example: "Briv"
 *               amount:
 *                 type: number
 *                 oneof:
 *                  - minimum: 0
 *                 example: 5
 *     responses:
 *       200:
 *         description: The temporary HP of the player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tempHp:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Invalid amount
 *       404:
 *         description: Player not found
 */
export const addTempHp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tempHpInfo = new HpModifyInfo();
    tempHpInfo.playerName = req.body.playerName;
    tempHpInfo.amount = req.body.amount;
    const errors = await validateRequest(tempHpInfo);
    if (errors) {
        res.status(400).json({
            message: 'Invalid request body.',
            Errors: errors,
        });
        return;
    }

    try {
        const result = await playerHpService.addTempHp(tempHpInfo);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof PlayerNotFoundError) {
            res.status(404).send(error.message);
            return;
        }
        next(error);
    }
};
