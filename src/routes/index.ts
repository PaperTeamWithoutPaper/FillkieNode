import express from 'express';
import dirRouter from './dir';
import fileRouter from './file';
import teamRouter from './team';

const router = express.Router();

router.use('/dir', dirRouter);
router.use('/file', fileRouter);
router.use('/team', teamRouter);

export default router;
