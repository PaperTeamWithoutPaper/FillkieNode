import express from 'express';
import oauthRouter from './oauth';

const router = express.Router();

router.use('/oauth', oauthRouter);

export default router;
