const express = require('express');
const controller = require('./winner.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

const router = express.Router();

// Public winner page — no auth required.
router.get('/public', controller.publicList);

router.get('/mine', authenticate, controller.myWins);

// Manually trigger a draw (the scheduler normally does this automatically).
router.post('/lottery/:lotteryId/draw', authenticate, authorize('admin', 'lottery_manager'), controller.runDraw);

module.exports = router;
