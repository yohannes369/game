

// const express = require('express');
// const { body } = require('express-validator');
// const rateLimit = require('express-rate-limit');
// const controller = require('./auth.controller');
// const { authenticate } = require('../../middleware/auth.middleware');

// const router = express.Router();

// // Basic brute-force protection on login
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many login attempts. Please try again later.' },
// });

// const usernameRule = body('username')
//   .trim()
//   .isLength({ min: 3, max: 50 })
//   .withMessage('Username must be between 3 and 50 characters.')
//   .matches(/^[a-zA-Z0-9_.-]+$/)
//   .withMessage('Username may only contain letters, numbers, dots, dashes and underscores.');

// const passwordRule = body('password')
//   .isLength({ min: 6 })
//   .withMessage('Password must be at least 6 characters long.');

// router.post(
//   '/register',
//   [
//     usernameRule,
//     passwordRule,

//     body('fullName')
//       .trim()
//       .notEmpty()
//       .withMessage('Full name is required.'),

//     body('location')
//       .optional()
//       .trim()
//       .isLength({ max: 150 })
//       .withMessage('Location cannot exceed 150 characters.')
//   ],
//   controller.register
// );


// router.post(
//   '/login',
//   loginLimiter,
//   [
//     usernameRule,
//     body('password')
//       .notEmpty()
//       .withMessage('Password is required.')
//   ],
//   controller.login
// );


// router.post('/refresh', controller.refresh);

// router.post('/logout', controller.logout);


// router.get(
//   '/me',
//   authenticate,
//   controller.me
// );


// // Change password (logged-in user)
// router.post(
//   '/change-password',
//   authenticate,
//   [
//     body('currentPassword')
//       .notEmpty()
//       .withMessage('Current password is required.'),

//     body('newPassword')
//       .isLength({ min: 6 })
//       .withMessage('New password must be at least 6 characters long.')
//   ],
//   controller.changePassword
// );


// module.exports = router;
const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const controller = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// =====================================================
// LOGIN RATE LIMITER
// =====================================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
});

// =====================================================
// VALIDATION
// =====================================================

const usernameRule = body('username')
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage('Username must be between 3 and 50 characters.')
  .matches(/^[a-zA-Z0-9_.-]+$/)
  .withMessage(
    'Username may only contain letters, numbers, dots, dashes and underscores.'
  );

const passwordRule = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long.');

// =====================================================
// REGISTER
// =====================================================

router.post(
  '/register',
  [
    usernameRule,

    passwordRule,

    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required.'),

    body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.')
      .isLength({ min: 9, max: 20 })
      .withMessage(
        'Phone number must be between 9 and 20 characters.'
      )
      .matches(/^[0-9+()\-\s]+$/)
      .withMessage('Please enter a valid phone number.'),

    body('location')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 150 })
      .withMessage('Location cannot exceed 150 characters.'),
  ],
  controller.register
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  '/login',
  loginLimiter,
  [
    usernameRule,

    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  controller.login
);

// =====================================================
// REFRESH
// =====================================================

router.post('/refresh', controller.refresh);

// =====================================================
// LOGOUT
// =====================================================

router.post('/logout', controller.logout);

// =====================================================
// CURRENT USER
// =====================================================

router.get(
  '/me',
  authenticate,
  controller.me
);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required.'),

    body('newPassword')
      .isLength({ min: 6 })
      .withMessage(
        'New password must be at least 6 characters long.'
      ),
  ],
  controller.changePassword
);

module.exports = router;