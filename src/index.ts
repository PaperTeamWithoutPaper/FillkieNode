import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import routes from './routes';
import errorHandler from './middlewares/error_handler';
import cors from 'cors';

/**
 * start app
 * @return {Promise<void>} resolves when started
 */
async function startApp(): Promise<void> {
    dotenv.config();

    const mongoURI = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoURI);

    const app = express();

    app.use(compression());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());
    app.use(routes);
    app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        errorHandler(err, req, res);
    });

    const port = Number(process.env.PORT || 8080);
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}

startApp()
    .catch((error) => {
        console.error(error);
    });
