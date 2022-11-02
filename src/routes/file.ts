import express from 'express';
import GoogleDriveException from '../exceptions/google_drive_exception';
import {asyncHandler} from '../middlewares/async_handler';
import auth from '../middlewares/auth';
import {initializeGoogleApi, RequestWithGoogleDrive} from '../middlewares/google_drive';
import {AssertedHeader, requireBody, requireQuery} from '../middlewares/requires';
import {isGoogleDriveFileId, isMongoId} from '../validators';
import mime from 'mime-types';
import {ReadStream} from 'fs';

const router = express.Router();

router.use(auth);

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
        const newFile = await drive.files.create({
            requestBody: {
                name: body.name + '.json',
                parents: [folderId],
            },
            media: {
                body: '{ data: "Hello!" }',
                mimeType: 'application/json',
            },
        });

        if (newFile.data.id === undefined) {
            throw new Error(newFile.statusText);
        }
    } catch (err) {
        throw new GoogleDriveException((err as Error).message);
    }

    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
}));

router.get('/', requireQuery({
    projectId: isMongoId,
    fileId: isGoogleDriveFileId,
}), initializeGoogleApi, asyncHandler(async (req, res) => {
    // TODO: check parent folder in project folder
    // TODO: check user has permission to read file

    const drive = (req as RequestWithGoogleDrive).drive;
    const query = req.query as AssertedHeader;

    const fileHeader = await drive.files.get({
        fileId: query.fileId,
        fields: '*',
    }).then((file) => file.data);

    const fileData = await drive.files.get({
        fileId: query.fileId,
        alt: 'media',
        acknowledgeAbuse: true,
    }, {
        responseType: 'stream',
    }).then((file) => file.data as ReadStream);


    const filename = fileHeader.name ?? 'sample.json';
    const mimetype = mime.lookup(filename);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
    function encodeRFC5987ValueChars(str: string) {
        return (
          encodeURIComponent(str)
            .replace(/['()]/g, escape)
            .replace(/\*/g, "%2A")
            .replace(/%(?:7C|60|5E)/g, unescape)
        );
      }

    res.setHeader(`Content-disposition`, `attachment; filename*=UTF-8''${encodeRFC5987ValueChars(filename)}`);
    res.setHeader('Content-type', mimetype || 'text/plain');

    fileData.pipe(res);
}));

router.patch('/', requireQuery({
    projectId: isMongoId,
    fileId: isGoogleDriveFileId,
    name: String,
    beforeParentId: isGoogleDriveFileId,
    afterParentId: isGoogleDriveFileId,
}), initializeGoogleApi, asyncHandler(async (req, res) => {
    // TODO: check user has permission to write file in this project
    // TODO: check folder(beforeParentId, afterParentId, file is in this project
    const drive = (req as RequestWithGoogleDrive).drive;
    const query = req.query as AssertedHeader;

    await drive.files.update({
        requestBody: {
            name: query.name,
        },
        fileId: query.fileId,
        addParents: query.afterParentId,
        removeParents: query.beforeParentId,
    });

    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
}));

router.delete('/', requireQuery({
    projectId: isMongoId,
    fileId: isGoogleDriveFileId,
}), initializeGoogleApi, asyncHandler(async (req, res) => {
    const drive = (req as RequestWithGoogleDrive).drive;
    const query = req.query as AssertedHeader;

    await drive.files.delete({
        fileId: query.fileId,
    });

    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
}));

export default router;
