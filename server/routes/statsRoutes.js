const express = require('express');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/', getStats);

module.exports = router;
