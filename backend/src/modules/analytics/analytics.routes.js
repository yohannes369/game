const express = require('express');
const controller = require('./analytics.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/analytics', controller.analytics);
router.get('/settings/:key', controller.getSetting);
router.put('/settings/:key', controller.setSetting);

module.exports = router;
