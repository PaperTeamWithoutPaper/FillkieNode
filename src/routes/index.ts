import express from 'express';
import dirRouter from './dir';
import fileRouter from './file';

const router = express.Router();

router.use('/dir', dirRouter);
router.use('/file', fileRouter);

export default router;
