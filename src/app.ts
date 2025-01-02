import express, { Request, Response, NextFunction } from 'express';
import damageRoutes from './routes/damageRoutes';
import healRoutes from './routes/healRoutes';
import tempHpRoutes from './routes/tempHpRoutes';
import { connect } from './db';
import { setupSwagger } from './swagger';

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

setupSwagger(app);

app.get('/', (_, res) => {
    res.redirect('/swagger');
});

connect()
    .then(() => {
        app.use('/damage', damageRoutes);
        app.use('/heal', healRoutes);
        app.use('/tempHp', tempHpRoutes);
        app.use(errorHandler);
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
};
