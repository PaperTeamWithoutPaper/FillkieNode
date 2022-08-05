import multer from 'multer';
import {RequestWithGoogleDrive} from './middlewares/google_drive';
import {AssertedHeader} from './middlewares/requires';
import mime from 'mime-types';

/**
 * Google Drive Storage for multer
 */
export default class GoogleDriveStorage implements multer.StorageEngine {
    /**
     * remove file
     * @param {Request} _req
     * @param {Express.Multer.File} _file
     * @param {ErrorHandler} cb
     */
    _removeFile(_req: RequestWithGoogleDrive, _file: Express.Multer.File, cb: (error: Error | null) => void): void {
        cb(new Error('remove file not implemented'));
    }
    /**
     * upload file
     * @param {RequestWithGoogleDrive} req
     * @param {Express.Multer.File} file
     * @param {ErrorHandler} cb
     */
    _handleFile(req: RequestWithGoogleDrive, file: Express.Multer.File, cb: (error: Error | null) => void): void {
        const body = req.body as AssertedHeader;
        req.drive.files.create({
            requestBody: {
                name: file.originalname,
                parents: [body.folderId],
            },
            media: {
                body: file.stream,
                mimeType: mime.lookup(file.originalname) || 'application/json',
            },
        }).then(() => {
            cb(null);
        }).catch((error) => {
            cb(error as Error);
        });
    }
}
