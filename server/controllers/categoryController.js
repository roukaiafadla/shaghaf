const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

module.exports = { getCategories, getCategoryBySlug };
