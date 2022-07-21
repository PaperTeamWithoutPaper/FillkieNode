import express from 'express';
import projectRouter from './project';

const router = express.Router();

router.use('/', projectRouter);

export default router;
