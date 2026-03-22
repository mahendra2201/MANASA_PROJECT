const express = require('express');
const router = express.Router();
const { getKpis, getPlatformStats } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/kpis', verifyToken, getKpis);
router.get('/platforms', verifyToken, getPlatformStats);
module.exports = router;
