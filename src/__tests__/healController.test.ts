import request from 'supertest';
import express from 'express';
import { heal } from '../controllers/healController';
import Player from '../models/player';

const app = express();
app.use(express.json());
app.post('/heal', heal);

jest.mock('../models/player');

describe('healPlayer', () => {
    it('should return 200 and update player HP', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 10,
            tempHp: 0,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/heal').send({
            playerName: 'Briv',
            amount: 5,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(15);
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should return 404 if player not found', async () => {
        (Player.findOne as jest.Mock).mockResolvedValue(null);
        const response = await request(app).post('/heal').send({
            playerName: 'Unknown',
            amount: 5,
        });
        expect(response.status).toBe(404);
        expect(response.text).toBe('Player not found');
    });

    it('should return 400 for invalid heal amount', async () => {
        const response = await request(app).post('/heal').send({
            playerName: 'Briv',
            amount: -10,
        });

        expect(response.status).toBe(400);
    });

    it('should not exceed hitPoints after healing', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 18,
            tempHp: 0,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/heal').send({
            playerName: 'Briv',
            amount: 5,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(20); // currentHp should not exceed hitPoints
        expect(mockPlayer.save).toHaveBeenCalled();
    });

    it('should not change tempHp after healing', async () => {
        const mockPlayer = {
            name: 'Briv',
            hitPoints: 20,
            currentHp: 10,
            tempHp: 5,
            save: jest.fn().mockResolvedValue(true),
        };
        (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
        const response = await request(app).post('/heal').send({
            playerName: 'Briv',
            amount: 5,
        });
        expect(response.status).toBe(200);
        expect(response.body.currentHp).toBe(15);
        expect(mockPlayer.tempHp).toBe(5); // tempHp should remain unchanged
        expect(mockPlayer.save).toHaveBeenCalled();
    });
});
