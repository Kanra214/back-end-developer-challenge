import { Request, Response } from 'express';
import Player from '../models/player';
import { BaseRequestBody, validateRequest } from '../shared/validator';

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
export const heal = async (req: Request, res: Response) => {
    const healInfo = new BaseRequestBody();
    healInfo.playerName = req.body.playerName;
    healInfo.amount = req.body.amount;
    if (!(await validateRequest(res, healInfo))) {
        return;
    }

    const player = await Player.findOne({ name: healInfo.playerName });
    if (player) {
        player.currentHp = Math.min(
            player.currentHp + healInfo.amount,
            player.hitPoints
        );
        await player.save();
        res.json({ currentHp: player.currentHp });
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
};
