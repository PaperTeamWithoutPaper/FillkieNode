import {NextFunction, Request, Response} from 'express';

type Handler<T> = (req: Request, res: Response, next: NextFunction) => T
type AsyncHandler = Handler<Promise<void>>

/**
 * async handler(async function adapter for express)
 * @param {AsyncHandler<T>} f the async function
 * @return {Handler<T>}
 */
export function asyncHandler(f: AsyncHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        f(req, res, next)
            .catch(next);
    };
}
