import express from 'express';
import {drive_v3 as DriveV3} from 'googleapis';
import GoogleDriveException from '../exceptions/google_drive_exception';
import {asyncHandler} from '../middlewares/async_handler';
import auth from '../middlewares/auth';
import {initializeGoogleApi, realCreateType, RequestWithGoogleDrive} from '../middlewares/google_drive';
import {AssertedHeader, requireBody, requireQuery} from '../middlewares/requires';
import MIME_TYPE_MAP from '../mime_type_map';
import {FILLKIE_STATUS_MESSAGES, responseError} from '../utils';
import {isGoogleDriveFileId, isMongoId} from '../validators';

const router = express.Router();

router.use(auth);

router.post('/', requireBody({
    name: String,
    projectId: isMongoId,
    folderId: isGoogleDriveFileId,
}), initializeGoogleApi, asyncHandler(async (req, res) => {
    // TODO: check parent folder in project folder
    // TODO: check user has permission to create folder in this project

    const body = req.body as AssertedHeader;
    const folderId = body.folderId;
    const drive = (req as RequestWithGoogleDrive).drive;

    try {
        const newFolder = await(drive.files.create as realCreateType)({
            fields: 'id',
            resource: {
                name: body.name,
                title: 'title of fillkie',
                mimeType: 'application/vnd.google-apps.folder',
                parents: [folderId],
            },
        });

        if (newFolder.data.id === undefined) {
            throw new Error(newFolder.statusText);
        }
    } catch (e) {
        throw new GoogleDriveException((e as Error).toString());
    }

    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
}));

router.get('/', (req, res) => {
    console.log('get:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.put('/', (req, res) => {
    console.log('put:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.delete('/', (req, res) => {
    console.log('delete:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

export default router;
