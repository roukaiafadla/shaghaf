const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Username, email and password are all required');
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    res.status(400);
    throw new Error('An account with that email or username already exists');
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

module.exports = { signup, login, getMe };
