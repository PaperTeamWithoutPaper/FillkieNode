import {Request, Response, NextFunction} from 'express';

/**
 * error handler
 *
 * @param {Error} err error from express
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
export default function handleError(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) {
    console.error(err);

    res
        .status(500)
        .json({
            success: false,
            code: 500,
            message: 'Internal Server Error',
        });
}
