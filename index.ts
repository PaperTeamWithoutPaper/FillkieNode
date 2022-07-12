import express from 'express';
import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import routes from './routes';

/**
 * start app
 * @return {Promise<void>} resolves when started
 */
async function startApp(): Promise<void> {
    dotenv.config();

    const mongoURI = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/test';
    const port = Number(process.env.PORT || 8080);
    await mongoose.connect(mongoURI);

    const app = express();

    app.use(compression());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use((_req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    app.use(routes);
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}

void startApp();
