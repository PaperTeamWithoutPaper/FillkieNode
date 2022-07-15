import express from 'express';
import projectRouter from './project';

const router = express.Router();

router.use('/project', projectRouter);

export default router;
