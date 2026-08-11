
const express = require('express');
const { body } = require('express-validator');
const controller = require('./lottery.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

const router = express.Router();

// 'admin' is treated as the super admin; 'lottery_manager' is the
// lottery-specific role added by database/lottery_schema.sql.
const MANAGE_ROLES = ['admin', 'lottery_manager'];

// ==============================
// Public / User Routes
// ==============================

// Get all lotteries
router.get('/', controller.list);

// Get lottery dashboard
router.get(
  '/:id/dashboard',
  authenticate,
  controller.dashboard
);

// Get lottery details
router.get('/:id', controller.getOne);

// ==============================
// Admin Routes
// ==============================

// Create Lottery
router.post(
  '/',
  authenticate,
  authorize(...MANAGE_ROLES),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Lottery name is required.'),

    body('ticketPrice')
      .isFloat({ gt: 0 })
      .withMessage('ticketPrice must be a positive number.'),

    body('ticketMode')
      .optional()
      .isIn(['fixed', 'package', 'custom'])
      .withMessage('Invalid ticketMode.'),

    body('startDate')
      .notEmpty()
      .withMessage('startDate is required.'),

    body('endDate')
      .notEmpty()
      .withMessage('endDate is required.'),

    body('spinAt')
      .notEmpty()
      .withMessage('spinAt is required.')
  ],
  controller.create
);

// Add Lottery Packages
router.post(
  '/:id/packages',
  authenticate,
  authorize(...MANAGE_ROLES),
  controller.addPackages
);

// Update Lottery
router.patch(
  '/:id',
  authenticate,
  authorize(...MANAGE_ROLES),
  controller.update
);

// Update Lottery Status
router.patch(
  '/:id/status',
  authenticate,
  authorize(...MANAGE_ROLES),
  controller.setStatus
);

// Delete Lottery
router.delete(
  '/:id',
  authenticate,
  authorize(...MANAGE_ROLES),
  controller.remove
);

module.exports = router;