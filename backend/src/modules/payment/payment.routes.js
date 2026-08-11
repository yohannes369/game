// const express = require('express');
// const controller = require('./payment.controller');
// const { authenticate } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');
// const upload = require('../../middleware/upload.middleware');

// const router = express.Router();

// const PAYMENT_ROLES = ['admin', 'payment_admin'];

// router.post('/', authenticate, upload.single('screenshot'), controller.submit);

// router.get('/', authenticate, authorize(...PAYMENT_ROLES), controller.listAll);
// router.get('/pending', authenticate, authorize(...PAYMENT_ROLES), controller.listPending);
// router.get('/mine', authenticate, controller.listMine);
// router.patch('/:id/approve', authenticate, authorize(...PAYMENT_ROLES), controller.approve);
// router.patch('/:id/reject', authenticate, authorize(...PAYMENT_ROLES), controller.reject);

// module.exports = router;
const express = require('express');
const controller = require('./payment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const upload = require('../../middleware/upload.middleware');

const router = express.Router();

const PAYMENT_ROLES = ['admin', 'payment_admin'];

router.post('/', authenticate, upload.single('screenshot'), controller.submit);

router.get('/', authenticate, authorize(...PAYMENT_ROLES), controller.listAll);
router.get('/pending', authenticate, authorize(...PAYMENT_ROLES), controller.listPending);
router.get('/mine', authenticate, controller.listMine);
router.get('/paid-users', authenticate, authorize('admin'), controller.listPaidUsers);
router.patch('/:id/approve', authenticate, authorize(...PAYMENT_ROLES), controller.approve);
router.patch('/:id/reject', authenticate, authorize(...PAYMENT_ROLES), controller.reject);

module.exports = router;