const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const controller = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// Basic brute-force protection on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
});

const usernameRule = body('username')
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage('Username must be between 3 and 50 characters.')
  .matches(/^[a-zA-Z0-9_.-]+$/)
  .withMessage('Username may only contain letters, numbers, dots, dashes and underscores.');

const passwordRule = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long.');

router.post(
  '/register',
  [usernameRule, passwordRule, body('fullName').trim().notEmpty().withMessage('Full name is required.')],
  controller.register
);

router.post('/login', loginLimiter, [usernameRule, body('password').notEmpty().withMessage('Password is required.')], controller.login);

router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
