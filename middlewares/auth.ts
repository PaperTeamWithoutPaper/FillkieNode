import {NextFunction, Request, Response} from 'express';
import {IncomingHttpHeaders} from 'http';
import jwt, {Jwt, JwtPayload} from 'jsonwebtoken';
import handleError from './error-handler';

type RequestWithJwt = Request & { jwt: Jwt };

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
        jwt.verify(token, process.env.JWT_SECRET as string, {algorithms: ['HS256'], complete: true}, (err, decoded) => {
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

    const payload = (decoded.payload as JwtPayload);
    const expiration = payload.exp || 0;

    if (expiration < Date.now()) {
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
            res.status(401).json({
                success: false,
                code: 401,
                message: 'Unauthorized',
            });
            return;
        }

        (req as RequestWithJwt).jwt = jwt;
        next();
    }).catch((error) => {
        handleError(error as Error, req, res, next);
    });
}
