// const withdrawalService = require('./withdrawal.service');
// const { HttpError } = require('../auth/auth.service');

// async function request(req, res, next) {
//   try {
//     const { winnerId, bankName, accountNumber, accountName } = req.body;
//     if (!winnerId || !bankName || !accountNumber || !accountName) {
//       throw new HttpError(422, 'winnerId, bankName, accountNumber and accountName are required.');
//     }
//     const withdrawal = await withdrawalService.requestWithdrawal(req.user.id, req.body);
//     res.status(201).json({ message: 'Withdrawal requested.', withdrawal });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listPending(req, res, next) {
//   try {
//     const withdrawals = await withdrawalService.listPending();
//     res.json({ withdrawals });
//   } catch (err) {
//     next(err);
//   }
// }

// async function markPaid(req, res, next) {
//   try {
//     const screenshotPath = req.file ? req.file.filename : null;
//     const withdrawal = await withdrawalService.markPaid(req.params.id, req.user.id, {
//       adminTransactionId: req.body.adminTransactionId,
//       screenshotPath,
//     });
//     res.json({ message: 'Withdrawal marked as paid.', withdrawal });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { request, listPending, markPaid };
const withdrawalService = require('./withdrawal.service');
const { HttpError } = require('../auth/auth.service');

async function request(req, res, next) {
  try {
    const { winnerId, bankName, accountNumber, accountName } = req.body;
    if (!winnerId || !bankName || !accountNumber || !accountName) {
      throw new HttpError(422, 'winnerId, bankName, accountNumber and accountName are required.');
    }
    const withdrawal = await withdrawalService.requestWithdrawal(req.user.id, req.body);
    res.status(201).json({ message: 'Withdrawal requested.', withdrawal });
  } catch (err) {
    next(err);
  }
}

async function listPending(req, res, next) {
  try {
    const withdrawals = await withdrawalService.listPending();
    res.json({ withdrawals });
  } catch (err) {
    next(err);
  }
}

async function markPaid(req, res, next) {
  try {
    if (!req.body.transactionId) {
      throw new HttpError(422, 'transactionId is required.');
    }
    const screenshotPath = req.file ? req.file.filename : null;
    const withdrawal = await withdrawalService.markPaid(req.params.id, req.user.id, {
      adminTransactionId: req.body.transactionId,
      screenshotPath,
    });
    res.json({ message: 'Withdrawal marked as paid.', withdrawal });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const { reason } = req.body;
    if (!reason) {
      throw new HttpError(422, 'reason is required.');
    }
    const withdrawal = await withdrawalService.rejectWithdrawal(req.params.id, req.user.id, reason);
    res.json({ message: 'Withdrawal rejected.', withdrawal });
  } catch (err) {
    next(err);
  }
}

module.exports = { request, listPending, markPaid, reject };