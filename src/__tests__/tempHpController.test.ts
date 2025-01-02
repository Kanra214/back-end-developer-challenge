import request from 'supertest';
import express from 'express';
import { addTempHp } from '../controllers/tempHpController';
import Player from '../models/player';

const app = express();
app.use(express.json());
app.post('/tempHp', addTempHp);

jest.mock('../models/player');

describe('addTempHp', () => {
    it('should return 200 and update player temp HP', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 20,
            tempHp: 0,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app)
            .post('/tempHp')
            .send({
                playerName: 'Briv',
                amount: 5,
            });
        expect(response.status).toBe(200);
        expect(response.body.tempHp).toBe(5);
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should return 404 if player not found', async () => {
        (Player.findOne as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/tempHp')
            .send({
                playerName: 'Unknown',
                amount: 5,
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Player not found');
    });

    it('should return 400 for invalid temp HP amount', async () => {
        const response = await request(app)
            .post('/tempHp')
            .send({
                playerName: 'Briv',
                amount: -5,
            });
        expect(response.status).toBe(400);
    });

    it('should correctly add temp HP without affecting current HP', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 15,
            tempHp: 0,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app)
            .post('/tempHp')
            .send({
                playerName: 'Briv',
                amount: 5,
            });
        expect(response.status).toBe(200);
        expect(response.body.tempHp).toBe(5); // tempHp should be updated
        expect(mockPlayer.currentHp).toBe(15); // currentHp should remain unchanged
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should not add temp HP if tempHp is already more than 0', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 15,
            tempHp: 5,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app)
            .post('/tempHp')
            .send({
                playerName: 'Briv',
                amount: 5,
            });
        expect(response.status).toBe(200);
        expect(response.body.tempHp).toBe(5); // tempHp should remain unchanged
        expect(mockPlayer.save).not.toHaveBeenCalled();
    });
});