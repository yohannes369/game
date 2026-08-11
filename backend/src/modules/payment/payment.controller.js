// const paymentService = require('./payment.service');
// const { HttpError } = require('../auth/auth.service');

// async function submit(req, res, next) {
//   try {
//     const { lotteryId, amount, method, senderName, phoneNumber, transactionId } = req.body;
//     if (!lotteryId || !amount || !method || !senderName || !phoneNumber || !transactionId) {
//       throw new HttpError(422, 'lotteryId, amount, method, senderName, phoneNumber and transactionId are required.');
//     }
//     const screenshotPath = req.file ? req.file.filename : null;
//     const payment = await paymentService.submitPayment(req.user.id, req.body, screenshotPath);
//     res.status(201).json({ message: 'Payment submitted and pending review.', payment });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listPending(req, res, next) {
//   try {
//     const payments = await paymentService.listPending();
//     res.json({ payments });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listAll(req, res, next) {
//   try {
//     const [payments, summary] = await Promise.all([
//       paymentService.listAll(req.query),
//       paymentService.summarizePayments(req.query),
//     ]);
//     res.json({ payments, summary });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listMine(req, res, next) {
//   try {
//     const payments = await paymentService.listMine(req.user.id);
//     res.json({ payments });
//   } catch (err) {
//     next(err);
//   }
// }

// async function approve(req, res, next) {
//   try {
//     const result = await paymentService.approvePayment(req.params.id, req.user.id);
//     res.json({ message: 'Payment approved, tickets generated.', ...result });
//   } catch (err) {
//     next(err);
//   }
// }

// async function reject(req, res, next) {
//   try {
//     const payment = await paymentService.rejectPayment(req.params.id, req.user.id, req.body.reason);
//     res.json({ message: 'Payment rejected.', payment });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { submit, listPending, listAll, listMine, approve, reject };
const paymentService = require('./payment.service');
const { HttpError } = require('../auth/auth.service');

async function submit(req, res, next) {
  try {
    const { lotteryId, amount, method, senderName, phoneNumber, transactionId } = req.body;
    if (!lotteryId || !amount || !method || !senderName || !phoneNumber || !transactionId) {
      throw new HttpError(422, 'lotteryId, amount, method, senderName, phoneNumber and transactionId are required.');
    }
    const screenshotPath = req.file ? req.file.filename : null;
    const payment = await paymentService.submitPayment(req.user.id, req.body, screenshotPath);
    res.status(201).json({ message: 'Payment submitted and pending review.', payment });
  } catch (err) {
    next(err);
  }
}

async function listPending(req, res, next) {
  try {
    const payments = await paymentService.listPending();
    res.json({ payments });
  } catch (err) {
    next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const [payments, summary] = await Promise.all([
      paymentService.listAll(req.query),
      paymentService.summarizePayments(req.query),
    ]);
    res.json({ payments, summary });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const payments = await paymentService.listMine(req.user.id);
    res.json({ payments });
  } catch (err) {
    next(err);
  }
}

async function listPaidUsers(req, res, next) {
  try {
    const result = await paymentService.listPaidUsers(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const result = await paymentService.approvePayment(req.params.id, req.user.id);
    res.json({ message: 'Payment approved, tickets generated.', ...result });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const payment = await paymentService.rejectPayment(req.params.id, req.user.id, req.body.reason);
    res.json({ message: 'Payment rejected.', payment });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit, listPending, listAll, listMine, listPaidUsers, approve, reject };