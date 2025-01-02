import mongoose, { Schema } from 'mongoose';
import { DamageType } from './damageType';

export interface IPlayer {
    _id: string;
    name: string;
    level: number;
    hitPoints: number;
    currentHp: number;
    tempHp: number;
    classes: Array<{
        name: string;
        hitDiceValue: number;
        classLevel: number;
    }>;
    stats: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    items: Array<{
        name: string;
        modifier: {
            affectedObject: string;
            affectedValue: string;
            value: number;
        };
    }>;
    defenses: Array<{
        type: DamageType;
        defense: 'resistance' | 'immunity';
    }>;
}

const PlayerSchema: Schema = new Schema<IPlayer>({
    _id: { type: String },
    name: { type: String, required: true, unique: true },
    level: { type: Number, required: true },
    hitPoints: { type: Number, required: true },
    currentHp: {
        type: Number,
        default: function () {
            return this.hitPoints;
        },
    },
    tempHp: { type: Number, default: 0 },
    classes: [
        {
            name: { type: String, required: true },
            hitDiceValue: { type: Number, required: true },
            classLevel: { type: Number, required: true },
        },
    ],
    stats: {
        strength: { type: Number, required: true },
        dexterity: { type: Number, required: true },
        constitution: { type: Number, required: true },
        intelligence: { type: Number, required: true },
        wisdom: { type: Number, required: true },
        charisma: { type: Number, required: true },
    },
    items: [
        {
            name: { type: String, required: true },
            modifier: {
                affectedObject: { type: String, required: true },
                affectedValue: { type: String, required: true },
                value: { type: Number, required: true },
            },
        },
    ],
    defenses: [
        {
            type: {
                type: String,
                required: true,
                enum: Object.values(DamageType),
                uppercase: true,
            },
            defense: { type: String, required: true },
        },
    ],
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
