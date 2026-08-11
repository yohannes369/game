// const express = require('express');
// const { body } = require('express-validator');
// const controller = require('./challenge.controller');
// const { authenticate } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');
// const upload = require('../../middleware/upload.middleware');

// const router = express.Router();
// const ADMIN_ROLES = ['admin', 'payment_admin', 'finance_admin'];
// const CHALLENGE_REVIEW_ROLES = ['admin', 'payment_admin'];
// const PAYOUT_ROLES = ['admin', 'finance_admin'];

// router.post(
//   '/',
//   authenticate,
//   [
//     body('amount').isIn([100, 200, 500]).withMessage('Amount must be 100, 200, or 500 Birr.'),
//   ],
//   controller.create
// );

// router.get('/available', authenticate, controller.listAvailable);
// router.get('/mine', authenticate, controller.listMine);
// router.get('/:challengeId', authenticate, controller.detail);
// router.post('/:challengeId/accept', authenticate, controller.accept);

// router.post(
//   '/:challengeId/pay',
//   authenticate,
//   upload.single('screenshot'),
//   [body('paymentReference').trim().notEmpty().withMessage('paymentReference is required.')],
//   controller.submitPayment
// );

// router.patch(
//   '/:challengeId/review',
//   authenticate,
//   authorize(...CHALLENGE_REVIEW_ROLES),
//   [body('approved').isBoolean().withMessage('approved must be true or false.')],
//   controller.reviewAdmin
// );

// router.post('/:challengeId/schedule', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.schedule);
// router.post('/:challengeId/draw', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.draw);

// router.post(
//   '/:challengeId/payout',
//   authenticate,
//   [
//     body('bankName').trim().notEmpty().withMessage('bankName is required.'),
//     body('accountNumber').trim().notEmpty().withMessage('accountNumber is required.'),
//     body('accountName').trim().notEmpty().withMessage('accountName is required.'),
//   ],
//   controller.requestPayout
// );

// router.patch(
//   '/:challengeId/payout',
//   authenticate,
//   authorize(...PAYOUT_ROLES),
//   upload.single('screenshot'),
//   [body('approved').isBoolean().withMessage('approved must be true or false.')],
//   controller.processPayout
// );

// router.get('/admin/review', authenticate, authorize(...ADMIN_ROLES), controller.listAdminReview);

// module.exports = router;
const express = require('express');
const { body } = require('express-validator');
const controller = require('./challenge.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const upload = require('../../middleware/upload.middleware');

const router = express.Router();

const ADMIN_ROLES = ['admin', 'payment_admin', 'finance_admin'];
const CHALLENGE_REVIEW_ROLES = ['admin', 'payment_admin'];
const PAYOUT_ROLES = ['admin', 'finance_admin'];

// ---------------------------------------------------------------------
// Player-facing routes
// ---------------------------------------------------------------------

router.post(
  '/',
  authenticate,
  [body('amount').isIn([100, 200, 500]).withMessage('Amount must be 100, 200, or 500 Birr.')],
  controller.create
);

router.get('/available', authenticate, controller.listAvailable);
router.get('/mine', authenticate, controller.listMine);
router.get('/:challengeId', authenticate, controller.detail);
router.post('/:challengeId/accept', authenticate, controller.accept);

router.post(
  '/:challengeId/pay',
  authenticate,
  upload.single('screenshot'),
  [
    body('paymentReference').trim().notEmpty().withMessage('paymentReference is required.'),
    body('senderName').trim().notEmpty().withMessage('senderName is required.'),
    body('phoneNumber').trim().notEmpty().withMessage('phoneNumber is required.'),
  ],
  controller.submitPayment
);

// Frontend expects the following admin endpoints; provide aliases that map
// to the controller functions below.
router.patch('/:challengeId/payment-review', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.paymentReview);
router.post('/:challengeId/approve', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.approveChallenge);
router.post('/:challengeId/reject', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.rejectChallenge);
router.patch('/:challengeId/payout-review', authenticate, authorize(...PAYOUT_ROLES), upload.single('screenshot'), controller.processPayout);

// Backwards-compatible admin-style route names used by the frontend.
router.patch('/:challengeId/admin/payment/:side', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.paymentReview);
router.post('/:challengeId/admin/approve', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.approveChallenge);
router.post('/:challengeId/admin/reject', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.rejectChallenge);
router.patch(
  '/:challengeId/admin/payout',
  authenticate,
  authorize(...PAYOUT_ROLES),
  upload.single('screenshot'),
  [body('approved').isBoolean().withMessage('approved must be true or false.')],
  controller.processPayout
);

router.post(
  '/:challengeId/payout',
  authenticate,
  [
    body('bankName').trim().notEmpty().withMessage('bankName is required.'),
    body('accountNumber').trim().notEmpty().withMessage('accountNumber is required.'),
    body('accountName').trim().notEmpty().withMessage('accountName is required.'),
  ],
  controller.requestPayout
);

// ---------------------------------------------------------------------
// Admin routes
// ---------------------------------------------------------------------

router.patch(
  '/:challengeId/review',
  authenticate,
  authorize(...CHALLENGE_REVIEW_ROLES),
  [body('approved').isBoolean().withMessage('approved must be true or false.')],
  controller.reviewAdmin
);

router.post('/:challengeId/schedule', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.schedule);
router.post('/:challengeId/draw', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.draw);

router.patch(
  '/:challengeId/payout',
  authenticate,
  authorize(...PAYOUT_ROLES),
  upload.single('screenshot'),
  [body('approved').isBoolean().withMessage('approved must be true or false.')],
  controller.processPayout
);

router.get('/admin/review', authenticate, authorize(...ADMIN_ROLES), controller.listAdminReview);

router.get('/admin/commission', authenticate, authorize(...PAYOUT_ROLES), controller.getCommission);
router.put(
  '/admin/commission',
  authenticate,
  authorize(...PAYOUT_ROLES),
  [body('ratePercent').isFloat({ min: 0, max: 100 }).withMessage('ratePercent must be between 0 and 100.')],
  controller.updateCommission
);

router.get('/admin/finance-report', authenticate, authorize(...PAYOUT_ROLES), controller.financeReport);

module.exports = router;