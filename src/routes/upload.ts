import express from 'express';
import multer from 'multer';
import BadRequestException from '../exceptions/bad_request_exception';
import GoogleDriveStorage from '../google_drive_storage';
import auth from '../middlewares/auth';
import {initializeGoogleApiByUser} from '../middlewares/google_drive';
import project from '../model/project';
import User from '../model/user';
import {responseError, responseSuccess} from '../utils';
import {isGoogleDriveFileId, isMongoId} from '../validators';

const router = express.Router();
const storage = new GoogleDriveStorage;

type HeaderLike = { [key: string]: string|undefined };
type Condition =
    StringConstructor
    | RegExp
    | NumberConstructor
    | BooleanConstructor
    | boolean
    | number
    | string;
type Conditions = {
    [key: string]: Condition
};

/**
 * validate value
 * @param {string} value value to be checked
 * @param {Condition} condition condition to check
 * @return {boolean} true if value matches condition
 */
function validate(value: string, condition: Condition) {
    if (condition === String) {
        return true;
    } else if (condition instanceof RegExp) {
        return condition.test(value);
    } else if (condition === Number) {
        return !isNaN(Number(value)) && isFinite(Number(value));
    } else if (condition === Boolean) {
        return value === 'true' || value === 'false';
    } else {
        return value == condition;
    }
}

/**
 * assert body can upload data
 * @param {HeaderLike} header
 * @param {Conditions} conditions conditions to check
 */
function assertBody(header: HeaderLike|undefined, conditions: Conditions) {
    if (header === undefined) {
        throw new BadRequestException(`body is required`);
    }

    // eslint-disable-next-line guard-for-in
    for (const key in conditions) {
        const value = header[key];
        if (value === undefined) {
            throw new BadRequestException(`${key} is required in body`);
        } else if (!validate(value, conditions[key])) {
            throw new BadRequestException(`${key} is invalid in body`);
        }
    }
}

const uploader = multer({
    storage,
    fileFilter(req, file, callback) {
        const body = req.body as { [key: string]: string|undefined };
        try {
            assertBody(body, {
                projectId: isMongoId,
                folderId: isGoogleDriveFileId,
            });
            project.findById(body.projectId).then(async (project) => {
                if (project === null) {
                    return callback(new Error('Project not found'));
                }

                const user = await User.findById(project.ownerId);

                if (user === null) {
                    const message = `User not found for project's ownerId(projectId=${
                        body.projectId as string
                    }, ownerId=${
                        project.ownerId.toString()
                    })`;
                    return callback(new Error(message));
                }

                initializeGoogleApiByUser(user, req);
                callback(null, true);
            }).catch((error) => {
                callback(error as Error);
            });
        } catch (e) {
            callback(e as Error);
        }
    },
});

router.post('/', auth, (req, res) => {
    uploader.single('file')(req, res, (error) => {
        if (error) {
            if (error instanceof BadRequestException) {
                return responseError(res, 400, error.message);
            }
            console.error(error);
            return responseError(res, 500);
        } else {
            return responseSuccess(res, 'Success');
        }
    });
});

export default router;
