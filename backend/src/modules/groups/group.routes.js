const express = require('express');
const { body } = require('express-validator');
const controller = require('./group.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);

// A group leader can view their own group without full admin rights
router.get('/mine', authorize('group_leader'), controller.myGroup);

// Everything else is admin-only
router.get('/', authorize('admin'), controller.list);
router.post(
  '/',
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Group name is required.')],
  controller.create
);
router.put('/:id', authorize('admin'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);
router.get('/:id/members', authorize('admin'), controller.members);

module.exports = router;
