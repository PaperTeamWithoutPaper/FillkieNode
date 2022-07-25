import {Request, Response} from 'express';
import GoogleDriveException from '../exceptions/google_drive_exception';
import {FILLKIE_STATUS_MESSAGES, responseError} from '../utils';

/**
 * error handler
 *
 * @param {Error | GoogleDriveException} err error from express
 * @param {Request} req request
 * @param {Response} res response
 */
export default function handleError(
    err: (Error | GoogleDriveException) & Partial<{ statusCode: number, expose: boolean }>,
    req: Request,
    res: Response,
) {
    if (err instanceof GoogleDriveException) {
        responseError(res, FILLKIE_STATUS_MESSAGES.GOOGLE_DRIVE_ERROR, err.message);
    } else if (err.statusCode !== undefined && err.expose) {
        responseError(res, err.statusCode);
    } else {
        console.error(req.url, req.ip, err);
        responseError(res, 500);
    }
}
