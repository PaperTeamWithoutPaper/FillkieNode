import express, {NextFunction, Request, Response} from 'express';
import compression from 'compression';
import helmet from 'helmet';
import routes from './routes';
import errorHandler from './middlewares/error_handler';
import cors from 'cors';

/**
 * create app
 * @return {Promise<void>} resolves when started
 */
function createApp() {
    const app = express();

    app.use(compression());
    app.use(helmet({
        crossOriginResourcePolicy: false,
    }));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());
    app.use('/node', routes);
    app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        errorHandler(err, req, res);
    });

    return app;
}

export default createApp();
