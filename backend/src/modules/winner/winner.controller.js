const winnerService = require('./winner.service');

async function runDraw(req, res, next) {
  try {
    const result = await winnerService.runDraw(req.params.lotteryId);
    res.json({ message: 'Draw completed.', ...result });
  } catch (err) {
    next(err);
  }
}

async function publicList(req, res, next) {
  try {
    const winners = await winnerService.listPublicWinners();
    res.json({ winners });
  } catch (err) {
    next(err);
  }
}

async function myWins(req, res, next) {
  try {
    const wins = await winnerService.myWins(req.user.id);
    res.json({ wins });
  } catch (err) {
    next(err);
  }
}

module.exports = { runDraw, publicList, myWins };
