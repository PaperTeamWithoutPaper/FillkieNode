import {ObjectId} from 'bson';
import express from 'express';
import {STATUS_CODES} from 'http';
import mongoose from 'mongoose';
import auth, {RequestWithAuth} from '../../middlewares/auth';
import handleError from '../../middlewares/error-handler';
import initializeGoogleApi from '../../middlewares/google-drive';
import {AssertedHeader, requireBody, requireParams} from '../../middlewares/requires';
import Project, {IProject} from '../../model/Project';
import {responseError, responseSuccess} from '../../utils';
import {isMongoId} from '../../validators';

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

router.post('/:teamId/project', requireBody({
    name: String,
}), requireParams({
    teamId: isMongoId,
}), (req, res) => {
    const body = req.body as AssertedHeader;
    const params = req.params as AssertedHeader;

    const name = body.name;
    const userId = (req as RequestWithAuth).userId;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);

    void createProject(name, userId, teamId).then(() => {
        responseSuccess(res);
    }).catch((err) => {
        handleError(err as Error, req, res);
    });
});

router.get('/:teamId/project', requireParams({
    teamId: isMongoId,
}), (req, res) => {
    const params = req.params as AssertedHeader;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);

    void Project.find({teamId}).then((projects: IProject[]) => {
        const json = {
            success: true,
            code: 200,
            message: STATUS_CODES[200] as string,
            data: projects.map((project) => ({
                id: project._id,
                name: project.name,
                ownerId: project.ownerId,
                teamId: project.teamId,
            })),
        };

        res
            .status(200)
            .json(json);
    });
});

router.get('/:teamId/project/:projectId', requireParams({
    teamId: isMongoId,
    projectId: isMongoId,
}), (req, res) => {
    const params = req.params as AssertedHeader;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);
    const projectId = mongoose.Types.ObjectId.createFromHexString(params.projectId);

    void Project.findOne({teamId, projectId}).then((project: IProject | null) => {
        if (project === null) {
            return responseError(res, 404);
        }

        const json = {
            success: true,
            code: 200,
            message: STATUS_CODES[200] as string,
            data: {
                id: project._id,
                name: project.name,
                ownerId: project.ownerId,
                teamId: project.teamId,
            },
        };

        res
            .status(200)
            .json(json);
    });
});

router.put('/', initializeGoogleApi, (req, res) => {
    console.log('put:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.delete('/', initializeGoogleApi, (req, res) => {
    console.log('delete:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

export default router;
