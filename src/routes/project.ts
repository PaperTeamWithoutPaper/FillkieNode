import {ObjectId} from 'bson';
import express from 'express';
import {STATUS_CODES} from 'http';
import mongoose from 'mongoose';
import auth, {RequestWithAuth} from '../middlewares/auth';
import handleError from '../middlewares/error-handler';
import initializeGoogleApi from '../middlewares/google-drive';
import {AssertedHeader, requireBody} from '../middlewares/requires';
import Project, {IProject} from '../model/Project';
import {responseSuccess} from '../utils';

const router = express.Router();

router.use(auth);

/**
 * create project
 * @param {string} name name of the project
 * @param {mongoose.Types.ObjectId} userId user id of the project
 * @param {mongoose.Types.ObjectId} teamId team id of the project
 * @return {Promise<IProject>} project
 */
function createProject(name: string,
    userId: ObjectId,
    teamId: ObjectId) {
    const project = new Project({
        name,
        ownerId: userId,
        teamId,
        roles: {},
    });
    return project.save();
}

router.post('/:teamId', requireBody(['name']), (req, res) => {
    const body = req.body as AssertedHeader;
    const name = body.name;
    const userId = (req as RequestWithAuth).userId;
    const teamId = mongoose.Types.ObjectId.createFromHexString(body.teamId);
    void createProject(name, userId, teamId).then(() => {
        responseSuccess(res);
    }).catch((err) => {
        handleError(err as Error, req, res);
    });
});

export default router;
