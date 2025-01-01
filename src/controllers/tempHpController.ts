import { Request, Response } from 'express';
import Player from '../models/player';

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
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: The temporary HP added to the player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tempHp:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: Player not found
 */
export const addTempHp = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const player = await Player.findOne({ name: 'Briv' });
    if (player) {
        player.hitPoints += amount; // Assuming temp HP is added to current HP
        await player.save();
        res.json({ tempHp: amount });
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
};
