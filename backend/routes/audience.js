const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/audienceController');
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/insights', verifyToken, getInsights);
module.exports = router;
