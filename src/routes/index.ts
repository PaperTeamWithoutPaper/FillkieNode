import express from 'express';
import dirRouter from './dir';
import fileRouter from './file';
import projectRouter from './project';

const router = express.Router();

router.use('/dir', dirRouter);
router.use('/file', fileRouter);
router.use('/project', projectRouter);

export default router;
