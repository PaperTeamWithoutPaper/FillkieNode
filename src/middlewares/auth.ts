import {ObjectId} from 'bson';
import {NextFunction, Request, Response} from 'express';
import {IncomingHttpHeaders} from 'http';
import jwt, {Jwt} from 'jsonwebtoken';
import mongoose from 'mongoose';
import {responseError} from '../utils';
import handleError from './error_handler';

export type RequestWithAuth = Request & { jwt: Jwt, userId: ObjectId };

/**
 * read token
 * if falid or expired, return null
 * @param {IncomingHttpHeaders} headers request headers
 * @return {Promise<Jwt | null>} decoded token
 */
async function readTokenFromHeader(headers: IncomingHttpHeaders) {
    const token = headers['authorization'];

    if (token === undefined) {
        return null;
    }

    const decoded = await new Promise<Jwt | null>((resolve) => {
        jwt.verify(
            token.substring('Bearer '.length),
            process.env.JWT_SECRET as string,
            {algorithms: ['HS256'],
                complete: true}, (err, decoded) => {
                if (err !== null) {
                    console.error(err);
                }
                if (err || decoded === undefined) {
                    resolve(null);
                } else {
                    resolve(decoded);
                }
            });
    });

    if (decoded === null) {
        return null;
    }

    return decoded;
}


/**
 * auth middleware
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
export default function auth(req: Request, res: Response, next: NextFunction) {
    readTokenFromHeader(req.headers).then((jwt) => {
        if (jwt === null) {
            return responseError(res, 401);
        }

        if (jwt.payload.sub === undefined) {
            const error = new Error(
                `Valid jwt, missing field 'sub' of payload`,
            );
            return handleError(error, req, res);
        }

        const reqWithAuth = req as RequestWithAuth;
        reqWithAuth.jwt = jwt;
        reqWithAuth.userId = mongoose.Types.ObjectId.createFromHexString(jwt.payload.sub as string);

        next();
    }).catch((error) => {
        return handleError(error as Error, req, res);
    });
}
