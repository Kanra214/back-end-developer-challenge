import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Player HP Management API',
            version: '1.0.0',
            description:
                "API for managing a player character's Hit Points (HP)",
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
