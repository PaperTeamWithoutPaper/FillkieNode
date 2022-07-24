import {ObjectId} from 'bson';
import express from 'express';
import {GaxiosPromise, GaxiosResponse} from 'gaxios';
import {drive_v3 as DriveV3} from 'googleapis';
import {STATUS_CODES} from 'http';
import mongoose from 'mongoose';
import GoogleDriveException from '../../exceptions/google_drive_exception';
import {asyncHandler} from '../../middlewares/async_handler';
import auth, {RequestWithAuth} from '../../middlewares/auth';
import handleError from '../../middlewares/error_handler';
import {
    Drive,
    initializeGoogleApi,
    initializeGoogleApiByUser,
    RequestWithGoogleDrive,
} from '../../middlewares/google_drive';
import {
    AssertedHeader,
    requireBody,
    requireParams,
} from '../../middlewares/requires';
import Project, {IProject} from '../../model/project';
import User, {IUser} from '../../model/user';
import {responseError, responseSuccess} from '../../utils';
import {isMongoId} from '../../validators';

const router = express.Router();

router.use(auth);

type real_create_type = (param: {
    fields: string,
    resource: {
        name: string,
        title?: string,
        mimeType: string,
        parents?: string[]
    }
}) => GaxiosPromise<DriveV3.Schema$File>;

/**
 * get fillkie folder
 * @param {IUser} user
 * @param {Drive} drive
 */
async function getFillkieFolder(user: IUser, drive: Drive) {
    if (user.google.rootDir) {
        return user.google.rootDir;
    }

    const fillkieFolder = await (drive.files.create as unknown as real_create_type)({
        fields: 'id',
        resource: {
            'name': 'fillkie',
            'title': 'title of fillkie',
            'mimeType': 'application/vnd.google-apps.folder',
        },
    });

    if (fillkieFolder.data.id === undefined) {
        throw new GoogleDriveException(fillkieFolder.statusText);
    }

    user.google.rootDir = fillkieFolder.data.id;

    await User.updateOne({
        _id: user._id,
    }, {
        $set: {
            'google.rootDir': user.google.rootDir,
        },
    });

    return user.google.rootDir;
}

/**
 * create project
 * @param {string} name name of the project
 * @param {IUser} user user id of the project
 * @param {mongoose.Types.ObjectId} teamId team id of the project
 * @param {Drive} drive google drive api
 * @return {Promise<IProject|null>} project
 */
async function createProject(
    name: string,
    user: IUser,
    teamId: ObjectId,
    drive: Drive,
) {
    let projectFolder: GaxiosResponse<DriveV3.Schema$File>;
    try {
        const fillkieFolder = await getFillkieFolder(user, drive);

        projectFolder = await (drive.files.create as real_create_type)({
            fields: 'id',
            resource: {
                name,
                title: 'title of fillkie',
                mimeType: 'application/vnd.google-apps.folder',
                parents: [fillkieFolder],
            },
        });

        if (projectFolder.data.id === undefined) {
            throw new Error(projectFolder.statusText);
        }
    } catch (e) {
        throw new GoogleDriveException((e as Error).toString());
    }

    const project = new Project({
        name,
        ownerId: user._id,
        teamId,
        dir: projectFolder.data.id,
        roles: {},
    });

    return await project.save();
}

router.post('/:teamId/project', requireBody({
    name: String,
}), requireParams({
    teamId: isMongoId,
}), asyncHandler(async (req, res) => {
    const body = req.body as AssertedHeader;
    const params = req.params as AssertedHeader;

    const name = body.name;
    const userId = (req as RequestWithAuth).userId;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);

    const user = await User.findById(userId);

    if (user === null) {
        return responseError(res, 404, 'User not found');
    }

    initializeGoogleApiByUser(user, req);

    // TODO: user has permission to create project in this team

    await createProject(
        name,
        user,
        teamId,
        (req as RequestWithGoogleDrive).drive,
    );

    responseSuccess(res);
}));

router.get('/:teamId/project', requireParams({
    teamId: isMongoId,
}), asyncHandler(async (req, res) => {
    const params = req.params as AssertedHeader;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);

    const projects = await Project.find({teamId});
    const json = {
        success: true,
        code: 200,
        message: STATUS_CODES[200] as string,
        data: projects.map((project) => ({
            id: project._id,
            name: project.name,
            ownerId: project.ownerId,
            teamId: project.teamId,
            folderId: project.dir,
        })),
    };

    // TODO: filter projects user has permission to read

    res
        .status(200)
        .json(json);
}));

router.get('/:teamId/project/:projectId', requireParams({
    teamId: isMongoId,
    projectId: isMongoId,
}), asyncHandler(async (req, res) => {
    const params = req.params as AssertedHeader;
    const teamId = mongoose.Types.ObjectId.createFromHexString(params.teamId);
    const projectId = mongoose.Types.ObjectId.createFromHexString(params.projectId);

    const project = await Project.findOne({teamId, projectId});

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
            folderId: project.dir,
        },
    };

    // TODO: check user has permission to read this project

    res
        .status(200)
        .json(json);
}));

router.put('/:teamId/project/:projectId', initializeGoogleApi, (req, res) => {
    console.log('put:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.delete('/:teamId/project/:projectId', initializeGoogleApi, (req, res) => {
    console.log('delete:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

export default router;
