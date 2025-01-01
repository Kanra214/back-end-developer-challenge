import mongoose, { Document, Schema } from 'mongoose';

interface IPlayer extends Document {
    id: string;
    name: string;
    level: number;
    hitPoints: number;
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
        type: string;
        defense: string;
    }>;
}

const PlayerSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: Number, required: true },
    hitPoints: { type: Number, required: true },
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
            type: { type: String, required: true },
            defense: { type: String, required: true },
        },
    ],
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
