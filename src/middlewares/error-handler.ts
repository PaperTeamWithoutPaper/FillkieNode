import {Request, Response, NextFunction} from 'express';
import {responseError} from '../utils';

/**
 * error handler
 *
 * @param {Error} err error from express
 * @param {Request} req request
 * @param {Response} res response
 */
export default function handleError(
    err: Error,
    req: Request,
    res: Response,
) {

    console.error(req, err);
    responseError(res, 500);
}
