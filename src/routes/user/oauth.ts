import express from 'express';

const router = express.Router();

router.get('/google', (req, res) => {
    console.log('get:', req.body);
    res.json({
        success: true,
        code: 200,
        message: 'success',
    });
});

export default router;
