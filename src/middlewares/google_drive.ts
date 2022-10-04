import express, {NextFunction, Request, Response} from 'express';
import {OAuth2Client} from 'google-auth-library';
import {drive_v3 as DriveV3, google} from 'googleapis';
import User, {IUser} from '../model/user';
import handleError from './error_handler';
import Project, {IProject} from '../model/project';
import {responseError as originalResponseError} from '../utils';
import BadRequestException from '../exceptions/bad_request_exception';

export type Drive = DriveV3.Drive;

export type RequestWithGoogleDrive = express.Request & {
    user: IUser,
    drive: Drive
}

/**
 * initialize google api by user id
 * @param {IUser} user
 * @param {Request} req
 */
export function initializeGoogleApiByUser(user: IUser, req: Request) {
    const auth = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL,
    );

    auth.on('tokens', (tokens) => {
        User.findByIdAndUpdate(user._id, {
            'google.accessToken': tokens.access_token ?? user.google.accessToken,
            'google.refreshToken': tokens.refresh_token ?? user.google.refreshToken,
        }).catch((error) => {
            console.error('error while saving new token', user._id, error);
        });
    });

    auth.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken,
    });

    google.options({auth});

    (req as RequestWithGoogleDrive).drive = google.drive({version: 'v3', auth});
}

/**
 * initialize google api
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 * @return {void} nothing
 */
export function initializeGoogleApi(
    req: Request,
    res: Response | undefined,
    next: NextFunction,
) {
    const projectId = req.query.projectId ?? (req.body as { projectId?: string }).projectId;

    /**
     * response error adapter
     * @param {Response|undefined} res
     * @param {number} code
     * @param {string} message
     */
    function responseError(res: Response | undefined, code: number, message: string) {
        if (res === undefined) {
            if (code === 400) {
                next(new BadRequestException(message));
            } else {
                next(new Error(message));
            }
        } else {
            originalResponseError(res, code, message);
        }
    }

    if (projectId === undefined) {
        return responseError(res, 400, 'projectId is required');
    }

    Project.findById(projectId)
        .then(async (project: IProject | null) => {
            if (project === null) {
                return responseError(res, 404, 'Project not found');
            }

            const user = await User.findById(project.ownerId);

            if (user === null) {
                const message = `User not found for project's ownerId(projectId=${
                    projectId.toString()
                }, ownerId=${
                    project.ownerId.toString()
                })`;
                return responseError(res, 500, message);
            }

            initializeGoogleApiByUser(user, req);

            next();
        })
        .catch((error) => {
            return responseError(res, 500, (error as Error).message);
        });

    return;
}
