const express = require('express');
const { generateResume } = require('../controllers/geminiController');

const router = express.Router();

// POST /api/resume/generate
router.post('/generate', generateResume);

module.exports = router;
