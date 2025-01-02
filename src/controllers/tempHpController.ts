import { Request, Response } from 'express';
import Player from '../models/player';
import { BaseRequestBody, validateRequest } from '../shared/validator';

/**
 * @swagger
 * /tempHp:
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
export const addTempHp = async (req: Request, res: Response) => {
    const tempHpInfo = new BaseRequestBody();
    tempHpInfo.playerName = req.body.playerName;
    tempHpInfo.amount = req.body.amount;
    if (!(await validateRequest(res, tempHpInfo))) {
        return;
    }

    const player = await Player.findOne({ name: tempHpInfo.playerName });
    if (player) {
        if (player.tempHp === 0) {
            player.tempHp += tempHpInfo.amount;
            await player.save();
        }
        res.json({ tempHp: player.tempHp });
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
};
