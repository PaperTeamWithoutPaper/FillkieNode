import {NextFunction, Request, RequestHandler, Response} from 'express';
import {responseError} from '../utils';

type HeaderLike = { [key: string]: string | undefined};
type Name = 'body' | 'params' | 'query' | 'headers';
export type AssertedHeader = { [key: string]: string };

/**
 * return middleware to check object[name] has fields
 * @param {string} name name of object
 * @param {string[]} fields array of fields to check
 * @return {RequestHandler<any>} middleware to check fields
 */
function requireFields(name: Name, fields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const object = req[name] as HeaderLike | undefined;

        if (object === undefined) {
            return responseError(res, 400, `${name} is required`);
        }

        const index = fields.findIndex((field) => object[field] === undefined);

        if (index === -1) {
            next();
        } else {
            return responseError(res, 400, `${fields[index]} is required in ${name}`);
        }
    };
}


/**
 * require body has some fields
 * @param { string[] } requirements array of requirements
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireBody(requirements: string[]) {
    return requireFields('body', requirements);
}

/**
 * require params has some fields
 * @param { string[] } requirements array of requirements
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireParam(requirements: string[]) {
    return requireFields('params', requirements);
}

/**
 * require query has some fields
 * @param { string[] } requirements array of requirements
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireQuery(requirements: string[]) {
    return requireFields('query', requirements);
}

/**
 * require header has some fields
 * @param { string[] } requirements array of requirements
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireHeader(requirements: string[]) {
    return requireFields('headers', requirements);
}
