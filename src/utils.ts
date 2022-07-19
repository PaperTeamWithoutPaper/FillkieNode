import {Response} from 'express';
import {STATUS_CODES as HTTP_STATUS_CODES} from 'http';

export type responseJson = {
    success: boolean,
    code: number,
    message: string,
    [key: string]: string | number | boolean,
}

const FILLKIE_STATUS_CODES: typeof HTTP_STATUS_CODES = {
    1000: 'Google Drive Error',
};

/**
 * FILLKIE_STATUS_CODES
 */
export class FILLKIE_STATUS_MESSAGES {
    GOOGLE_DRIVE_ERROR = 1000;
}

/**
 * response error
 * @param {Response} res
 * @param {number} statusCode
 * @param {string?} message
 */
export function responseError(res: Response, statusCode: number, message?: string) {
    message = message ?? HTTP_STATUS_CODES[statusCode] ?? FILLKIE_STATUS_CODES[statusCode];

    if (message === undefined) {
        console.log(`Unknown status code: ${statusCode}`);
        statusCode = 500;
        message = 'Internal Server Error';
    }

    const json: responseJson = {
        success: false,
        code: statusCode in HTTP_STATUS_CODES ? statusCode : 500,
        message: message,
    };

    res
        .status(statusCode)
        .json(json);
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
        // 200 always has message
        message: message ?? HTTP_STATUS_CODES[statusCode] as string,
    };

    res
        .status(statusCode)
        .json(json);
}
