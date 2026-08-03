const express = require('express');
const { getCategories, getCategoryBySlug } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
