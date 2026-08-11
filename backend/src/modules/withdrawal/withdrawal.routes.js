// const express = require('express');
// const controller = require('./withdrawal.controller');
// const { authenticate } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');
// const upload = require('../../middleware/upload.middleware');

// const router = express.Router();

// const FINANCE_ROLES = ['admin', 'finance_admin'];

// router.post('/', authenticate, controller.request);
// router.get('/pending', authenticate, authorize(...FINANCE_ROLES), controller.listPending);
// router.patch('/:id/pay', authenticate, authorize(...FINANCE_ROLES), upload.single('screenshot'), controller.markPaid);

// module.exports = router;
const express = require('express');
const controller = require('./withdrawal.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const upload = require('../../middleware/upload.middleware');

const router = express.Router();

const FINANCE_ROLES = ['admin', 'finance_admin'];

router.post('/', authenticate, controller.request);
router.get('/pending', authenticate, authorize(...FINANCE_ROLES), controller.listPending);
router.patch('/:id/pay', authenticate, authorize(...FINANCE_ROLES), upload.single('screenshot'), controller.markPaid);
router.patch('/:id/reject', authenticate, authorize(...FINANCE_ROLES), controller.reject);

module.exports = router;