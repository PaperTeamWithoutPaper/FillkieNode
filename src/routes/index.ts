import express from 'express';
import userRouter from './user';
import dirRouter from './dir';
import fileRouter from './file';

const router = express.Router();

router.use('/user', userRouter);
router.use('/dir', dirRouter);
router.use('/file', fileRouter);

export default router;
