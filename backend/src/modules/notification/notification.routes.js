const express = require('express');
const controller = require('./notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', controller.list);
router.patch('/:id/read', controller.markRead);
// Admin can send arbitrary notifications to users
const { authorize } = require('../../middleware/role.middleware');
router.post('/send', authorize('admin'), controller.send);

module.exports = router;
