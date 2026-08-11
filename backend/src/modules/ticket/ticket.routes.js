const express = require('express');
const controller = require('./ticket.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/lottery/:lotteryId/mine', authenticate, controller.myTickets);

module.exports = router;
