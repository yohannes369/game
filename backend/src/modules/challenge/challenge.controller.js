
// const { validationResult } = require('express-validator');
// const challengeService = require('./challenge.service');
// const settingsService = require('./settings.service');
// const { HttpError } = require('../auth/auth.service');

// function checkValidation(req) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     throw new HttpError(422, errors.array()[0].msg);
//   }
// }

// async function create(req, res, next) {
//   try {
//     checkValidation(req);
//     const challenge = await challengeService.createChallenge(req.user.id, req.body);
//     res.status(201).json({ message: 'Challenge created.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listAvailable(req, res, next) {
//   try {
//     const challenges = await challengeService.listAvailableChallenges(req.user.id);
//     try {
//       console.debug(`[challenge] listAvailable for user ${req.user.id}: ${(challenges || []).length} rows`);
//     } catch {}
//     res.json({ challenges: challenges || [] });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listMine(req, res, next) {
//   try {
//     const challenges = await challengeService.listUserChallenges(req.user.id);
//     res.json({ challenges: challenges || [] });
//   } catch (err) {
//     next(err);
//   }
// }

// async function detail(req, res, next) {
//   try {
//     const challenge = await challengeService.getChallengeById(req.params.challengeId);
//     if (!challenge) {
//       throw new HttpError(404, 'Challenge not found.');
//     }
//     res.json({ challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function accept(req, res, next) {
//   try {
//     const challenge = await challengeService.acceptChallenge(req.user.id, req.params.challengeId);
//     res.json({ message: 'Challenge accepted.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function submitPayment(req, res, next) {
//   try {
//     checkValidation(req);
//     const challenge = await challengeService.submitPaymentReference(req.user.id, req.params.challengeId, {
//       paymentReference: req.body.paymentReference,
//       screenshotPath: req.file ? req.file.filename : null,
//       senderName: req.body.senderName || req.body.firstName || null,
//       phoneNumber: req.body.phoneNumber || req.body.phone || null,
//     });
//     res.json({ message: 'Payment reference submitted.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function reviewAdmin(req, res, next) {
//   try {
//     checkValidation(req);
//     const challenge = await challengeService.markAdminReview(req.params.challengeId, req.user.id, req.body.approved);
//     res.json({ message: 'Challenge review completed.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// // Admin: approve/reject a single player's payment side
// async function paymentReview(req, res, next) {
//   try {
//     const side = req.params.side || req.body.side;
//     const { approved, reason } = req.body;
//     if (!side || typeof approved === 'undefined') {
//       return res.status(422).json({ message: 'side and approved are required.' });
//     }
//     const result = await challengeService.approvePlayerPayment(
//       req.params.challengeId,
//       req.user.id,
//       side,
//       approved === true || approved === 'true',
//       reason
//     );
//     res.json({ message: 'Payment side reviewed.', challenge: result });
//   } catch (err) {
//     next(err);
//   }
// }

// // Admin: finalize (approve) a challenge
// async function approveChallenge(req, res, next) {
//   try {
//     const challenge = await challengeService.markAdminReview(req.params.challengeId, req.user.id, true);
//     res.json({ message: 'Challenge approved and scheduled.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// // Admin: reject challenge entirely
// async function rejectChallenge(req, res, next) {
//   try {
//     const reason = req.body.reason || null;
//     const challenge = await challengeService.markAdminReview(req.params.challengeId, req.user.id, false, reason);
//     res.json({ message: 'Challenge rejected.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function schedule(req, res, next) {
//   try {
//     const challenge = await challengeService.scheduleDraw(req.params.challengeId);
//     res.json({ message: 'Challenge scheduled for draw.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function draw(req, res, next) {
//   try {
//     const challenge = await challengeService.runDraw(req.params.challengeId);
//     res.json({ message: 'Challenge draw completed.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function requestPayout(req, res, next) {
//   try {
//     checkValidation(req);
//     const challenge = await challengeService.requestPayout(req.user.id, req.params.challengeId, req.body);
//     res.json({ message: 'Payout request submitted.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function processPayout(req, res, next) {
//   try {
//     checkValidation(req);
//     const challenge = await challengeService.processPayout(
//       req.params.challengeId,
//       req.user.id,
//       req.body.approved === 'true' || req.body.approved === true,
//       {
//         transactionId: req.body.transactionId,
//         screenshotPath: req.file ? req.file.filename : null,
//         reason: req.body.reason,
//       }
//     );
//     res.json({ message: 'Payout processing completed.', challenge });
//   } catch (err) {
//     next(err);
//   }
// }

// async function listAdminReview(req, res, next) {
//   try {
//     const includeSinglePaid = req.query.includeSinglePaid !== 'false';
//     const challenges = await challengeService.listAdminReviewChallenges({ includeSinglePaid });

//     const rawList = Array.isArray(challenges) ? challenges : [];

//     // Filter matching both normalized database fields and legacy alias fields
//     const filtered = rawList.filter((c) => {
//       const creatorPaid = Boolean(
//         c.paymentReferenceCreator ||
//         c.creatorPaymentRef ||
//         c.paymentStatusCreator === 'submitted' ||
//         c.creatorPaymentStatus === 'submitted' ||
//         c.creatorPaid
//       );
//       const challengerPaid = Boolean(
//         c.paymentReferenceChallenger ||
//         c.acceptorPaymentRef ||
//         c.paymentStatusChallenger === 'submitted' ||
//         c.acceptorPaymentStatus === 'submitted' ||
//         c.acceptorPaid
//       );

//       // Keep if at least one player has submitted payment or if challenge status implies active review
//       return (
//         creatorPaid ||
//         challengerPaid ||
//         ['ADMIN_REVIEW', 'WINNER_REQUESTED_PAYOUT', 'PAYOUT_REVIEW'].includes(c.status)
//       );
//     });

//     res.json({ challenges: filtered });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getCommission(req, res, next) {
//   try {
//     const ratePercent = await settingsService.getCommissionRatePercent();
//     res.json({ ratePercent });
//   } catch (err) {
//     next(err);
//   }
// }

// async function updateCommission(req, res, next) {
//   try {
//     checkValidation(req);
//     const ratePercent = await settingsService.setCommissionRatePercent(req.body.ratePercent);
//     res.json({ message: 'Commission updated.', ratePercent });
//   } catch (err) {
//     next(err);
//   }
// }

// async function financeReport(req, res, next) {
//   try {
//     const report = await challengeService.getFinanceReport();
//     res.json(report);
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = {
//   create,
//   listAvailable,
//   listMine,
//   detail,
//   accept,
//   submitPayment,
//   reviewAdmin,
//   paymentReview,
//   approveChallenge,
//   rejectChallenge,
//   schedule,
//   draw,
//   requestPayout,
//   processPayout,
//   listAdminReview,
//   getCommission,
//   updateCommission,
//   financeReport,
// };

const { validationResult } = require('express-validator');
const challengeService = require('./challenge.service');
const settingsService = require('./settings.service');
const { HttpError } = require('../auth/auth.service');

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, errors.array()[0].msg);
  }
}

async function create(req, res, next) {
  try {
    checkValidation(req);
    const challenge = await challengeService.createChallenge(req.user.id, req.body);
    res.status(201).json({ message: 'Challenge created.', challenge });
  } catch (err) {
    next(err);
  }
}

async function listAvailable(req, res, next) {
  try {
    const challenges = await challengeService.listAvailableChallenges(req.user.id);
    try {
      console.debug(`[challenge] listAvailable for user ${req.user.id}: ${(challenges || []).length} rows`);
    } catch {}
    res.json({ challenges: challenges || [] });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const challenges = await challengeService.listUserChallenges(req.user.id);
    res.json({ challenges: challenges || [] });
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const challenge = await challengeService.getChallengeById(req.params.challengeId);
    if (!challenge) {
      throw new HttpError(404, 'Challenge not found.');
    }
    res.json({ challenge });
  } catch (err) {
    next(err);
  }
}

async function accept(req, res, next) {
  try {
    const challenge = await challengeService.acceptChallenge(req.user.id, req.params.challengeId);
    res.json({ message: 'Challenge accepted.', challenge });
  } catch (err) {
    next(err);
  }
}

async function submitPayment(req, res, next) {
  try {
    checkValidation(req);
    const challenge = await challengeService.submitPaymentReference(req.user.id, req.params.challengeId, {
      paymentReference: req.body.paymentReference,
      screenshotPath: req.file ? req.file.filename : null,
      senderName: req.body.senderName || req.body.firstName || null,
      phoneNumber: req.body.phoneNumber || req.body.phone || null,
    });
    res.json({ message: 'Payment reference submitted.', challenge });
  } catch (err) {
    next(err);
  }
}

async function reviewAdmin(req, res, next) {
  try {
    checkValidation(req);
    const challenge = await challengeService.markAdminReview(
      req.params.challengeId,
      req.user.id,
      req.body.approved,
      req.body.reason || null
    );
    res.json({ message: 'Challenge review completed.', challenge });
  } catch (err) {
    next(err);
  }
}

// Admin: approve/reject a single player's payment side
async function paymentReview(req, res, next) {
  try {
    // Support both route param (/admin/payment/:side) and body field
    const side = req.params.side || req.body.side;
    const { approved, reason } = req.body;

    if (!side || typeof approved === 'undefined') {
      return res.status(422).json({ message: 'side and approved are required.' });
    }

    const result = await challengeService.approvePlayerPayment(
      req.params.challengeId,
      req.user.id,
      side,
      approved === true || approved === 'true',
      reason
    );
    res.json({ message: 'Payment side reviewed.', challenge: result });
  } catch (err) {
    next(err);
  }
}

// Admin: finalize (approve) a challenge — both sides must already be APPROVED
async function approveChallenge(req, res, next) {
  try {
    const challenge = await challengeService.markAdminReview(req.params.challengeId, req.user.id, true);
    res.json({ message: 'Challenge approved and scheduled.', challenge });
  } catch (err) {
    next(err);
  }
}

// Admin: reject challenge entirely
async function rejectChallenge(req, res, next) {
  try {
    const reason = req.body.reason || null;
    const challenge = await challengeService.markAdminReview(req.params.challengeId, req.user.id, false, reason);
    res.json({ message: 'Challenge rejected.', challenge });
  } catch (err) {
    next(err);
  }
}

async function schedule(req, res, next) {
  try {
    const challenge = await challengeService.scheduleDraw(req.params.challengeId);
    res.json({ message: 'Challenge scheduled for draw.', challenge });
  } catch (err) {
    next(err);
  }
}

async function draw(req, res, next) {
  try {
    const challenge = await challengeService.runDraw(req.params.challengeId);
    res.json({ message: 'Challenge draw completed.', challenge });
  } catch (err) {
    next(err);
  }
}

async function requestPayout(req, res, next) {
  try {
    checkValidation(req);
    const challenge = await challengeService.requestPayout(req.user.id, req.params.challengeId, req.body);
    res.json({ message: 'Payout request submitted.', challenge });
  } catch (err) {
    next(err);
  }
}

async function processPayout(req, res, next) {
  try {
    checkValidation(req);
    const challenge = await challengeService.processPayout(
      req.params.challengeId,
      req.user.id,
      req.body.approved === 'true' || req.body.approved === true,
      {
        transactionId: req.body.transactionId,
        screenshotPath: req.file ? req.file.filename : null,
        reason: req.body.reason,
      }
    );
    res.json({ message: 'Payout processing completed.', challenge });
  } catch (err) {
    next(err);
  }
}

async function listAdminReview(req, res, next) {
  try {
    const challenges = await challengeService.listAdminReviewChallenges();

    const rawList = Array.isArray(challenges) ? challenges : [];

    // Filter: include challenges where at least one player has submitted payment
    // or where the challenge status explicitly calls for admin action
    const filtered = rawList.filter((c) => {
      const creatorPaid = Boolean(
        c.paymentReferenceCreator ||
        c.creatorPaymentRef ||
        c.paymentStatusCreator === 'SUBMITTED' ||
        c.paymentStatusCreator === 'submitted' ||
        c.creatorPaymentStatus === 'submitted' ||
        c.creatorPaid
      );
      const challengerPaid = Boolean(
        c.paymentReferenceChallenger ||
        c.acceptorPaymentRef ||
        c.paymentStatusChallenger === 'SUBMITTED' ||
        c.paymentStatusChallenger === 'submitted' ||
        c.acceptorPaymentStatus === 'submitted' ||
        c.acceptorPaid
      );

      return (
        creatorPaid ||
        challengerPaid ||
        ['ADMIN_REVIEW', 'WINNER_REQUESTED_PAYOUT', 'PAYOUT_REVIEW'].includes(c.status)
      );
    });

    res.json({ challenges: filtered });
  } catch (err) {
    next(err);
  }
}

async function getCommission(req, res, next) {
  try {
    const ratePercent = await settingsService.getCommissionRatePercent();
    res.json({ ratePercent });
  } catch (err) {
    next(err);
  }
}

async function updateCommission(req, res, next) {
  try {
    checkValidation(req);
    const ratePercent = await settingsService.setCommissionRatePercent(req.body.ratePercent);
    res.json({ message: 'Commission updated.', ratePercent });
  } catch (err) {
    next(err);
  }
}

async function financeReport(req, res, next) {
  try {
    const report = await challengeService.getFinanceReport();
    res.json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  listAvailable,
  listMine,
  detail,
  accept,
  submitPayment,
  reviewAdmin,
  paymentReview,
  approveChallenge,
  rejectChallenge,
  schedule,
  draw,
  requestPayout,
  processPayout,
  listAdminReview,
  getCommission,
  updateCommission,
  financeReport,
};