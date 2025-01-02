import Player, { IPlayer } from '../models/player';
import { DamageType } from '../models/damageType';
import { PlayerNotFoundError } from '../shared/playerNotFoundError';
import { DamageInfo, HpModifyInfo } from '../shared/validator';

export class PlayerHpService {
    private static instance: PlayerHpService;

    public static getInstance(): PlayerHpService {
        if (!PlayerHpService.instance) {
            PlayerHpService.instance = new PlayerHpService();
        }
        return PlayerHpService.instance;
    }

    async dealDamage(damageInfo: DamageInfo) {
        const player = await Player.findOne({ name: damageInfo.playerName });
        if (!player) {
            throw new PlayerNotFoundError();
        }

        const totalHpToReduce = this.calculateHpToReduce(
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

        return { currentHp: player.currentHp, tempHp: player.tempHp };
    }

    async healPlayer(hpModifyInfo: HpModifyInfo) {
        const player = await Player.findOne({ name: hpModifyInfo.playerName });
        if (!player) {
            throw new PlayerNotFoundError();
        }

        player.currentHp = Math.min(
            player.hitPoints,
            player.currentHp + hpModifyInfo.amount
        );
        await player.save();

        return { currentHp: player.currentHp };
    }

    async addTempHp(hpModifyInfo: HpModifyInfo) {
        const player = await Player.findOne({ name: hpModifyInfo.playerName });
        if (!player) {
            throw new PlayerNotFoundError();
        }

        if (player.tempHp === 0) {
            player.tempHp = hpModifyInfo.amount;
            await player.save();
        }

        return { tempHp: player.tempHp, currentHp: player.currentHp };
    }

    private calculateHpToReduce(
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
}
