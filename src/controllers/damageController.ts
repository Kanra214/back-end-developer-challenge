import { Request, Response } from 'express';
import Player, { IPlayer } from '../models/player';
import { DamageType } from '../models/damageType';
import { DamageRequestBody, validateRequest } from '../shared/validator';

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
export const dealDamage = async (req: Request, res: Response) => {
    const damageInfo = new DamageRequestBody();
    damageInfo.playerName = req.body.playerName;
    damageInfo.amount = req.body.amount;
    damageInfo.damageType = req.body.damageType;
    if (!(await validateRequest(res, damageInfo))) {
        return;
    }

    const player = await Player.findOne({ name: damageInfo.playerName });
    if (player) {
        const totalHpToReduce = CalculateHpToReduce(
            player,
            damageInfo.damageType,
            damageInfo.amount
        );
        const tempHpToReduce = Math.min(player.tempHp, totalHpToReduce);
        const currentHpToReduce = Math.min(
            player.currentHp,
            totalHpToReduce - tempHpToReduce
        );
        player.tempHp -= tempHpToReduce;
        player.currentHp -= currentHpToReduce;
        await player.save();
        res.status(200).json({
            currentHp: player.currentHp,
            tempHp: player.tempHp,
        });
    } else {
        res.status(404).send('Player not found');
    }
};

function CalculateHpToReduce(
    player: IPlayer,
    damageType: DamageType,
    amount: number
): number {
    const foundDefense = player.defenses?.find(
        (defense) => defense.type === damageType
    );
    if (foundDefense) {
        if (foundDefense.defense === 'resistance')
            return Math.floor(amount / 2);
        if (foundDefense.defense === 'immunity') return 0;
    }
    return amount;
}
