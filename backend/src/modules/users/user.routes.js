const express = require('express');
const { body } = require('express-validator');
const controller = require('./user.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

const router = express.Router();

// Every route below requires a logged-in admin
router.use(authenticate, authorize('admin'));

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.post(
  '/',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('role').isIn(['admin', 'group_leader', 'user']).withMessage('Invalid role.'),
  ],
  controller.create
);

router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
