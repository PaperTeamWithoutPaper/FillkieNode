import express from 'express';
import auth from '../middlewares/auth';
import {initializeGoogleApi} from '../middlewares/google_drive';

const router = express.Router();

router.use(auth);
router.use(initializeGoogleApi);

router.post('/', (req, res) => {
    console.log('post:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.get('/', (req, res) => {
    console.log('get:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.put('/', (req, res) => {
    console.log('put:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

router.delete('/', (req, res) => {
    console.log('delete:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

export default router;
