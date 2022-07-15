/* eslint-disable camelcase */
import express, {NextFunction, Request, Response} from 'express';
import {OAuth2Client} from 'google-auth-library';
import {drive_v3, google} from 'googleapis';
import User, {IUser} from '../model/User';
import handleError from './error-handler';
import Project, {IProject} from '../model/Project';
import {responseError} from '../utils';

export type RequestWithGoogleDrive = express.Request & {
    drive: drive_v3.Drive
}

/**
 * initialize google api
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 * @return {void} nothing
 */
export default function initializeGoogleApi(req: Request, res: Response, next: NextFunction) {
    const projectId = req.query.projectId;

    if (projectId === undefined) {
        return responseError(res, 400, 'projectId is required');
    }

    void Project.findById(projectId)
        .then(async (project: IProject | null) => {
            if (project === null) {
                return responseError(res, 404, 'Project not found');
            }

            const user = await User.findById(project.ownerId);

            if (user === null) {
                return handleError(new Error(`User not found for project's ownerId(projectId=${
                    projectId.toString()
                }, ownerId=${
                    project.ownerId.toString()
                }`), req, res);
            }

            const auth = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URL,
            );

            auth.setCredentials({
                access_token: user.accessToken,
                refresh_token: user.refreshToken,
            });

            (req as RequestWithGoogleDrive).drive = google.drive({version: 'v3', auth});

            next();
        })
        .catch((error) => {
            return handleError(error as Error, req, res);
        });

    return;
}