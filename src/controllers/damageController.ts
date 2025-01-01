import { Request, Response } from 'express';
import Player from '../models/player';

/**
 * @swagger
 * /damage:
 *   post:
 *     summary: Deal damage to the player
 *     tags: [Damage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
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
 *                   example: 15
 *       404:
 *         description: Player not found
 */
export const dealDamage = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const player = await Player.findOne({ name: 'Briv' });
    if (player) {
        player.hitPoints = Math.max(player.hitPoints - amount, 0);
        await player.save();
        res.json({ currentHp: player.hitPoints });
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
};
