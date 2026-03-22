const express = require('express');
const router = express.Router();
const { getAll, getOne } = require('../controllers/campaignController');
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, getOne);
module.exports = router;
