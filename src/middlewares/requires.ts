import {NextFunction, Request, RequestHandler, Response} from 'express';
import {responseError} from '../utils';

type Name = 'body' | 'params' | 'query' | 'headers';
export type AssertedHeader = { [key: string]: string };
type HeaderLike = Partial<AssertedHeader>;
type Condition =
    StringConstructor
    | RegExp
    | NumberConstructor
    | BooleanConstructor
    | boolean
    | number
    | string;
type Conditions = {
    [key: string]: Condition
};

/**
 * validate value
 * @param {string} value value to be checked
 * @param {Condition} condition condition to check
 * @return {boolean} true if value matches condition
 */
function validate(value: string, condition: Condition) {
    if (condition === String) {
        return true;
    } else if (condition instanceof RegExp) {
        return condition.test(value);
    } else if (condition === Number) {
        return !isNaN(Number(value)) && isFinite(Number(value));
    } else if (condition === Boolean) {
        return value === 'true' || value === 'false';
    } else {
        return value == condition;
    }
}

/**
 * return middleware to validate req[name] has fields
 * @param {string} name name of object
 * @param {Conditions} conditions conditions to check
 * @return {RequestHandler<any>} middleware to check fields
 */
function requireFields(name: Name, conditions: Conditions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const object = req[name] as HeaderLike | undefined;

        if (object === undefined) {
            return responseError(res, 400, `${name} is required`);
        }

        // eslint-disable-next-line guard-for-in
        for (const key in conditions) {
            const value = object[key];
            if (value === undefined) {
                return responseError(res, 400, `${key} is required in ${name}`);
            } else if (!validate(value, conditions[key])) {
                return responseError(res, 400, `${key} is invalid in ${name}`);
            }
        }

        next();
    };
}


/**
 * return middleware to validate req.body has fields
 * @param { Conditions } conditions conditions to check
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireBody(conditions: Conditions) {
    return requireFields('body', conditions);
}

/**
 * return middleware to validate req.params has fields
 * @param { Conditions } conditions conditions to check
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireParams(conditions: Conditions) {
    return requireFields('params', conditions);
}

/**
 * return middleware to validate req.query has fields
 * @param { Conditions } conditions conditions to check
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireQuery(conditions: Conditions) {
    return requireFields('query', conditions);
}

/**
 * return middleware to validate req.headers has fields
 * @param { Conditions } conditions conditions to check
 * @return {RequestHandler<any>} middleware to check fields
 */
export function requireHeader(conditions: Conditions) {
    return requireFields('headers', conditions);
}
