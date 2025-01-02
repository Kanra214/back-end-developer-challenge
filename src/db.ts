import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';
import Player from './models/player';

let mongoServer: MongoMemoryServer;

export const connect = async () => {
    let uri: string | undefined;
    let dataPath: string;
    if (process.env.NODE_ENV === 'production') {
        uri = process.env.MONGO_URI;
        dataPath = 'data';
    } else {
        mongoServer = await MongoMemoryServer.create({
            instance: {
                port: 27017, // Expose the in-memory MongoDB on port 27017
            },
        });
        uri = mongoServer.getUri();
        dataPath = '../data';
    }
    if (!uri) {
        throw new Error('Failed to get MongoDB URI');
    }
    await mongoose.connect(uri);
    await loadInitialData(dataPath);
};

const loadInitialData = async (dataPath: string) => {
    const dataDir = path.join(__dirname, dataPath);
    const files = fs.readdirSync(dataDir);

    for (const file of files) {
        const filePath = path.join(dataDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        const playerData = JSON.parse(data);
        playerData._id = filePath; // Add file path to player data
        await Player.create(playerData);
    }
};

export const closeDatabase = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await mongoose.connection.dropDatabase();
        await mongoServer.stop();
    }
    await mongoose.connection.close();
};

export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};
