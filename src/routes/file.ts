import express from 'express';
import GoogleDriveException from '../exceptions/google_drive_exception';
import {asyncHandler} from '../middlewares/async_handler';
import auth from '../middlewares/auth';
import {initializeGoogleApi, realCreateType, RequestWithGoogleDrive} from '../middlewares/google_drive';
import {AssertedHeader, requireBody, requireQuery} from '../middlewares/requires';
import {isGoogleDriveFileId, isMongoId} from '../validators';

const router = express.Router();

router.use(auth);
router.use(initializeGoogleApi);

router.post('/', requireBody({
    name: String,
    projectId: isMongoId,
    folderId: isGoogleDriveFileId,
}), initializeGoogleApi, asyncHandler(async (req, res) => {
    // TODO: check parent folder in project folder
    // TODO: check user has permission to create file

    const body = req.body as AssertedHeader;
    const drive = (req as RequestWithGoogleDrive).drive;
    const folderId = body.folderId;

    try {
        const file = await (drive.files.create as realCreateType)({
            resource: {
                name: body.name + '.json',
                title: 'title of fillkie',
                parents: [folderId],
            },
            media: {
                body: '{ data: "Hello!"}',
                mimeType: 'application/json',
            },
            fields: 'id',
        });
    } catch (err) {
        throw new GoogleDriveException((err as Error).message);
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
