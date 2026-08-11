const { pool } = require('../../config/db');
const ticketService = require('./ticket.service');

async function myTickets(req, res, next) {
  try {
    const tickets = await ticketService.listForUser(pool, {
      lotteryId: req.params.lotteryId,
      userId: req.user.id,
    });
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
}

module.exports = { myTickets };
