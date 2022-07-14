import {NextFunction, Request, Response} from 'express';
import {IncomingHttpHeaders} from 'http';
import jwt, {Jwt, JwtPayload} from 'jsonwebtoken';
import mongoose from 'mongoose';
import {responseError} from '../utils';
import handleError from './error-handler';

export type RequestWithAuth = Request & { jwt: Jwt, userId: mongoose.Types.ObjectId };

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

    console.log(token);

    const decoded = await new Promise<Jwt | null>((resolve) => {
        jwt.verify(
            token.substring('Bearer '.length),
            process.env.JWT_SECRET as string,
            {algorithms: ['HS256'],
                complete: true}, (err, decoded) => {
                console.log(err, decoded);
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
    void readTokenFromHeader(req.headers).then((jwt) => {
        if (jwt === null) {
            return responseError(res, 401);
        }

        if (jwt.payload.sub === undefined) {
            return handleError(new Error(`Valid jwt, missing field 'sub' of payload`), req, res);
        }

        const reqWithAuth = req as RequestWithAuth;
        reqWithAuth.jwt = jwt;
        reqWithAuth.userId = new mongoose.Types.ObjectId(jwt.payload.sub as string);

        next();
    }).catch((error) => {
        return handleError(error as Error, req, res);
    });
}
