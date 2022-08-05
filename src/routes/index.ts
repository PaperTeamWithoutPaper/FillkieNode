import express from 'express';
import userRouter from './user';
import dirRouter from './dir';
import fileRouter from './file';
import teamRouter from './team';
import uploadRouter from './upload';

const router = express.Router();

router.use('/user', userRouter);
router.use('/dir', dirRouter);
router.use('/file', fileRouter);
router.use('/team', teamRouter);
router.use('/upload', uploadRouter);

export default router;
