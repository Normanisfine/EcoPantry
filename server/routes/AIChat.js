const express = require('express');
const router = express.Router();
const protect = require('../middleWare/authMiddleware');
const { chat } = require('../controllers/aiController');


router.post("/", protect, chat);

module.exports = router;