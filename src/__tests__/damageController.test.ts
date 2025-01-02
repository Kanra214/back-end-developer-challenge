import request from 'supertest';
import express from 'express';
import { dealDamage } from '../controllers/damageController';
import Player from '../models/player';
import { DamageType } from '../models/damageType';

const app = express();
app.use(express.json());
app.post('/dealDamage', dealDamage);

jest.mock('../models/player');

describe('dealDamage', () => {
    it('should return 200 and update player HP', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 20,
            tempHp: 0,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: 10,
            damageType: DamageType.Fire,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(10);
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should return 404 if player not found', async () => {
        (Player.findOne as jest.Mock).mockResolvedValue(null);

        const response = await request(app).post('/dealDamage').send({
            playerName: 'Unknown',
            amount: 10,
            damageType: DamageType.Fire,
        });

        expect(response.status).toBe(404);
        expect(response.text).toBe('Player not found');
    });

    it('should return 400 for invalid damage type', async () => {
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: 10,
            damageType: 'InvalidType',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 for invalid damage amount', async () => {
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: -10,
            damageType: DamageType.Fire,
        });

        expect(response.status).toBe(400);
    });

    it('should correctly calculate damage with resistance', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 20,
            tempHp: 0,
            defenses: [{ type: DamageType.Fire, defense: 'resistance' }],
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: 10,
            damageType: DamageType.Fire,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(15); // 10 / 2 = 5 damage
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should correctly calculate damage with immunity', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 20,
            tempHp: 0,
            defenses: [{ type: DamageType.Fire, defense: 'immunity' }],
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: 10,
            damageType: DamageType.Fire,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(20); // 10 damage reduced to 0
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should correctly reduce tempHp before currentHp', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 20,
            tempHp: 5,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/dealDamage').send({
            playerName: 'Briv',
            amount: 10,
            damageType: DamageType.Fire,
        });
        expect(response.status).toBe(200);
        expect(response.body.tempHp).toBe(0); // 5 tempHp reduced first
        expect(response.body.currentHp).toBe(15); // remaining 5 damage to currentHp
        expect(mockPlayer.save).toHaveBeenCalled();
    });
});
