const express = require('express');
const { exportResume } = require('../controllers/exportController');

const router = express.Router();

// POST /api/export/download
router.post('/download', exportResume);

module.exports = router;
