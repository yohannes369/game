
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

// // ---------------------------------------------------------------------
// // Player-facing routes
// // ---------------------------------------------------------------------

// router.post(
//   '/',
//   authenticate,
//   [body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0 Birr.')],
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
//   [
//     body('paymentReference').trim().notEmpty().withMessage('paymentReference is required.'),
//     body('senderName').trim().notEmpty().withMessage('senderName is required.'),
//     body('phoneNumber').trim().notEmpty().withMessage('phoneNumber is required.'),
//   ],
//   controller.submitPayment
// );

// // Frontend expects the following admin endpoints; provide aliases that map
// // to the controller functions below.
// router.patch('/:challengeId/payment-review', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.paymentReview);
// router.post('/:challengeId/approve', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.approveChallenge);
// router.post('/:challengeId/reject', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.rejectChallenge);
// router.patch('/:challengeId/payout-review', authenticate, authorize(...PAYOUT_ROLES), upload.single('screenshot'), controller.processPayout);

// // Backwards-compatible admin-style route names used by the frontend.
// router.patch('/:challengeId/admin/payment/:side', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.paymentReview);
// router.post('/:challengeId/admin/approve', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.approveChallenge);
// router.post('/:challengeId/admin/reject', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.rejectChallenge);
// router.patch(
//   '/:challengeId/admin/payout',
//   authenticate,
//   authorize(...PAYOUT_ROLES),
//   upload.single('screenshot'),
//   [body('approved').isBoolean().withMessage('approved must be true or false.')],
//   controller.processPayout
// );

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

// // ---------------------------------------------------------------------
// // Admin routes
// // ---------------------------------------------------------------------

// router.patch(
//   '/:challengeId/review',
//   authenticate,
//   authorize(...CHALLENGE_REVIEW_ROLES),
//   [body('approved').isBoolean().withMessage('approved must be true or false.')],
//   controller.reviewAdmin
// );

// router.post('/:challengeId/schedule', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.schedule);
// router.post('/:challengeId/draw', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.draw);

// router.patch(
//   '/:challengeId/payout',
//   authenticate,
//   authorize(...PAYOUT_ROLES),
//   upload.single('screenshot'),
//   [body('approved').isBoolean().withMessage('approved must be true or false.')],
//   controller.processPayout
// );

// router.get('/admin/review', authenticate, authorize(...ADMIN_ROLES), controller.listAdminReview);

// router.get('/admin/commission', authenticate, authorize(...PAYOUT_ROLES), controller.getCommission);
// router.put(
//   '/admin/commission',
//   authenticate,
//   authorize(...PAYOUT_ROLES),
//   [body('ratePercent').isFloat({ min: 0, max: 100 }).withMessage('ratePercent must be between 0 and 100.')],
//   controller.updateCommission
// );

// router.get('/admin/finance-report', authenticate, authorize(...PAYOUT_ROLES), controller.financeReport);

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

// ─────────────────────────────────────────────────────────────
// Player-facing routes
// ─────────────────────────────────────────────────────────────

router.post(
  '/',
  authenticate,
  [body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0 Birr.')],
  controller.create
);

router.get('/available', authenticate, controller.listAvailable);
router.get('/mine', authenticate, controller.listMine);

// ─── Admin static routes must come BEFORE /:challengeId param routes ───
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

// ─── Dynamic :challengeId routes ───
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

// ─────────────────────────────────────────────────────────────
// Admin action routes — primary names used by the frontend
// ─────────────────────────────────────────────────────────────

// Review a single player's payment side: PATCH /challenges/:challengeId/payment-review
// body: { side: 'creator'|'challenger', approved: bool, reason?: string }
router.patch(
  '/:challengeId/payment-review',
  authenticate,
  authorize(...CHALLENGE_REVIEW_ROLES),
  controller.paymentReview
);

// Approve the whole challenge (after both sides approved)
router.post('/:challengeId/approve', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.approveChallenge);

// Reject the whole challenge
router.post('/:challengeId/reject', authenticate, authorize(...CHALLENGE_REVIEW_ROLES), controller.rejectChallenge);

// Process payout
router.patch(
  '/:challengeId/payout-review',
  authenticate,
  authorize(...PAYOUT_ROLES),
  upload.single('screenshot'),
  controller.processPayout
);

// ─────────────────────────────────────────────────────────────
// Backwards-compatible aliases used by legacy frontend paths
// ─────────────────────────────────────────────────────────────

// PATCH /challenges/:challengeId/admin/payment/:side
router.patch(
  '/:challengeId/admin/payment/:side',
  authenticate,
  authorize(...CHALLENGE_REVIEW_ROLES),
  controller.paymentReview
);

router.post(
  '/:challengeId/admin/approve',
  authenticate,
  authorize(...CHALLENGE_REVIEW_ROLES),
  controller.approveChallenge
);

router.post(
  '/:challengeId/admin/reject',
  authenticate,
  authorize(...CHALLENGE_REVIEW_ROLES),
  controller.rejectChallenge
);

router.patch(
  '/:challengeId/admin/payout',
  authenticate,
  authorize(...PAYOUT_ROLES),
  upload.single('screenshot'),
  [body('approved').isBoolean().withMessage('approved must be true or false.')],
  controller.processPayout
);

// ─────────────────────────────────────────────────────────────
// Player payout request
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Remaining admin routes
// ─────────────────────────────────────────────────────────────

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

module.exports = router;