import express from 'express';
import { connect } from './db';
import { setupSwagger } from './swagger';
import { dealDamage } from './controllers/damageController';
import { heal } from './controllers/healController';
import { addTempHp } from './controllers/tempHpController';

connect()
    .then(() => {
        const app = express();
        const port = 3000;

        app.use(express.urlencoded());
        app.use(express.json());

        setupSwagger(app);

        app.get('/', (_, res) => {
            res.redirect('/swagger');
        });

        app.post('/dealDamage', dealDamage);
        app.post('/heal', heal);
        app.post('/addTempHp', addTempHp);
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });
