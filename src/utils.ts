import {Response} from 'express';
import {STATUS_CODES} from 'http';

export type responseJson = {
    success: boolean,
    code: number,
    message: string,
    [key: string]: string | number | boolean,
}

/**
 * response error
 * @param {Response} res
 * @param {number} statusCode
 * @param {string | undefined} message
 */
export function responseError(res: Response, statusCode: number, message?: string) {
    const json: responseJson = {
        success: false,
        code: statusCode,
        message: message ?? STATUS_CODES[statusCode] as string,
    };

    if (typeof res.status !== 'function') {
        console.error('something wrong', message);
        res.json({
            success: false,
            code: 500,
            message: 'something wrong',
        });
    } else {
        res
            .status(statusCode)
            .json(json);
    }
}


/**
 * response success
 * @param {Response} res
 * @param {string | undefined} message
 */
export function responseSuccess(res: Response, message?: string) {
    const statusCode = 200;
    const json: responseJson = {
        success: true,
        code: statusCode,
        message: message ?? STATUS_CODES[statusCode] as string,
    };

    res
        .status(statusCode)
        .json(json);
}
