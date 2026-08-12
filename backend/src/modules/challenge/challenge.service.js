
// const { pool, withTransaction } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');
// const { secureShuffle, generateSeed } = require('../../utils/random');
// const notificationService = require('../notification/notification.service');
// const settingsService = require('./settings.service');

// const VALID_STATUSES = [
//   'WAITING',
//   'ACCEPTED',
//   'PAYMENT_PENDING',
//   'ADMIN_REVIEW',
//   'APPROVED',
//   'NUMBERS_ASSIGNED',
//   'DRAW_SCHEDULED',
//   'DRAW_COMPLETED',
//   'WINNER_REQUESTED_PAYOUT',
//   'PAYOUT_REVIEW',
//   'PAID',
//   'CANCELLED',
// ];

// const DRAW_DELAY_MINUTES = 2;

// function normalizeChallengeRow(row) {
//   if (!row) return null;
//   return {
//     id: row.id,
//     challengeId: row.challenge_id,
//     creatorId: row.creator_id,
//     challengerId: row.challenger_id,
//     amount: Number(row.amount),
//     totalPot: Number(row.amount) * 2,
//     status: row.status,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,

//     paymentReferenceCreator: row.payment_reference_creator,
//     senderNameCreator: row.sender_name_creator,
//     phoneCreator: row.phone_creator,
//     screenshotCreator: row.screenshot_creator,
//     paymentReferenceChallenger: row.payment_reference_challenger,
//     senderNameChallenger: row.sender_name_challenger,
//     phoneChallenger: row.phone_challenger,
//     screenshotChallenger: row.screenshot_challenger,
//     paymentStatusCreator: row.payment_status_creator || 'PENDING',
//     paymentStatusChallenger: row.payment_status_challenger || 'PENDING',
//     paymentRejectionReasonCreator: row.payment_rejection_reason_creator,
//     paymentRejectionReasonChallenger: row.payment_rejection_reason_challenger,

//     approvedBy: row.approved_by,
//     approvedAt: row.approved_at,
//     ticketNumberCreator: row.ticket_number_creator,
//     ticketNumberChallenger: row.ticket_number_challenger,

//     randomSeed: row.random_seed,
//     winnerUserId: row.winner_user_id,
//     winnerTicketNumber: row.winner_ticket_number,
//     drawAt: row.draw_at,

//     bankName: row.bank_name,
//     accountNumber: row.account_number,
//     accountName: row.account_name,
//     payoutRequestedAt: row.payout_requested_at,
//     payoutStatus: row.payout_status,
//     payoutApprovedBy: row.payout_approved_by,
//     payoutApprovedAt: row.payout_approved_at,
//     payoutTransactionId: row.payout_transaction_id,
//     payoutScreenshotPath: row.payout_screenshot_path,
//     payoutRejectionReason: row.payout_rejection_reason,

//     commissionRatePercent: row.commission_rate_percent !== null && row.commission_rate_percent !== undefined
//       ? Number(row.commission_rate_percent)
//       : null,
//     commissionAmount: row.commission_amount !== null && row.commission_amount !== undefined
//       ? Number(row.commission_amount)
//       : null,
//     payoutNetAmount: row.payout_net_amount !== null && row.payout_net_amount !== undefined
//       ? Number(row.payout_net_amount)
//       : null,
//   };
// }

// async function validatePlayerEligibility(conn, userId) {
//   const [rows] = await conn.query(`SELECT id FROM users WHERE id = ? LIMIT 1`, [userId]);
//   if (!rows[0]) throw new HttpError(404, 'User not found.');
// }

// async function createChallenge(userId, { amount }) {
//   const entryAmount = Number(amount);

//   if (isNaN(entryAmount) || entryAmount <= 0) {
//     throw new HttpError(422, 'Invalid challenge amount. Amount must be a positive number.');
//   }

//   await validatePlayerEligibility(pool, userId);

//   const [result] = await pool.query(
//     `INSERT INTO challenges (challenge_id, creator_id, amount, status)
//      VALUES (?, ?, ?, 'WAITING')`,
//     [generateSeed().slice(0, 12), userId, entryAmount]
//   );

//   const [rows] = await pool.query('SELECT * FROM challenges WHERE id = ?', [result.insertId]);
//   const created = normalizeChallengeRow(rows[0]);

//   try {
//     const [users] = await pool.query('SELECT id, full_name FROM users WHERE id != ?', [userId]);
//     const userIds = users.map((u) => u.id);
//     const creatorName = (await pool.query('SELECT full_name FROM users WHERE id = ?', [userId]))[0][0].full_name;
//     const message = `${creatorName} created a ${entryAmount} Birr challenge.`;

//     await notificationService.create({
//       userIds,
//       type: 'challenge_created',
//       title: 'New Challenge',
//       body: message,
//     });
//   } catch (err) {
//     console.error('[challenge] failed to notify users about new challenge:', err && err.message);
//   }

//   return created;
// }

// async function listAvailableChallenges(userId) {
//   const [rows] = await pool.query(
//     `SELECT c.*, u.full_name AS creator_name
//      FROM challenges c
//      JOIN users u ON u.id = c.creator_id
//      WHERE c.status = 'WAITING' AND c.creator_id != ?
//      ORDER BY c.created_at ASC`,
//     [userId]
//   );
//   return rows.map((row) => ({ ...normalizeChallengeRow(row), creatorName: row.creator_name }));
// }

// async function listUserChallenges(userId) {
//   const [rows] = await pool.query(
//     `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
//      FROM challenges c
//      LEFT JOIN users u ON u.id = c.creator_id
//      LEFT JOIN users v ON v.id = c.challenger_id
//      WHERE c.creator_id = ? OR c.challenger_id = ?
//      ORDER BY c.created_at DESC`,
//     [userId, userId]
//   );
//   return rows.map((row) => ({
//     ...normalizeChallengeRow(row),
//     creatorName: row.creator_name,
//     challengerName: row.challenger_name,
//   }));
// }

// async function getChallengeById(challengeId) {
//   const [rows] = await pool.query(
//     `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
//      FROM challenges c
//      LEFT JOIN users u ON u.id = c.creator_id
//      LEFT JOIN users v ON v.id = c.challenger_id
//      WHERE c.challenge_id = ?
//      LIMIT 1`,
//     [challengeId]
//   );
//   if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//   return {
//     ...normalizeChallengeRow(rows[0]),
//     creatorName: rows[0].creator_name,
//     challengerName: rows[0].challenger_name,
//   };
// }

// async function acceptChallenge(userId, challengeId) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (challenge.creator_id === userId) {
//       throw new HttpError(422, 'You cannot accept your own challenge.');
//     }
//     if (challenge.status !== 'WAITING') {
//       throw new HttpError(422, 'Challenge is no longer available.');
//     }

//     await validatePlayerEligibility(conn, userId);
//     await validatePlayerEligibility(conn, challenge.creator_id);

//     await conn.query(
//       `UPDATE challenges SET challenger_id = ?, status = 'ACCEPTED', updated_at = NOW() WHERE id = ?`,
//       [userId, challenge.id]
//     );

//     await notificationService.create(
//       {
//         userId: challenge.creator_id,
//         type: 'challenge_accepted',
//         title: 'Your challenge was accepted',
//         body: `A player has accepted your ${challenge.amount} Birr challenge. Complete payment to move forward.`,
//       },
//       conn
//     );

//     const [updatedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(updatedRows[0]);
//   });
// }

// async function submitPaymentReference(userId, challengeId, { paymentReference, screenshotPath, senderName, phoneNumber }) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (!['ACCEPTED', 'PAYMENT_PENDING'].includes(challenge.status)) {
//       throw new HttpError(422, 'Payments are not expected at this stage.');
//     }
//     if (![challenge.creator_id, challenge.challenger_id].includes(userId)) {
//       throw new HttpError(403, 'You are not part of this challenge.');
//     }

//     const isCreator = userId === challenge.creator_id;
//     const otherPaymentReference = isCreator
//       ? challenge.payment_reference_challenger
//       : challenge.payment_reference_creator;

//     const paymentRefField = isCreator ? 'payment_reference_creator' : 'payment_reference_challenger';
//     const screenshotField = isCreator ? 'screenshot_creator' : 'screenshot_challenger';
//     const senderNameField = isCreator ? 'sender_name_creator' : 'sender_name_challenger';
//     const phoneField = isCreator ? 'phone_creator' : 'phone_challenger';

//     const nextStatus = otherPaymentReference ? 'ADMIN_REVIEW' : 'PAYMENT_PENDING';

//     await conn.query(
//       `UPDATE challenges
//          SET ${paymentRefField} = ?,
//              ${screenshotField} = ?,
//              ${senderNameField} = ?,
//              ${phoneField} = ?,
//              status = ?,
//              updated_at = NOW()
//        WHERE id = ?`,
//       [paymentReference, screenshotPath || null, senderName, phoneNumber, nextStatus, challenge.id]
//     );

//     if (nextStatus === 'ADMIN_REVIEW') {
//       await notificationService.create(
//         {
//           userId: challenge.creator_id === userId ? challenge.challenger_id : challenge.creator_id,
//           type: 'challenge_ready_for_review',
//           title: 'Both payments submitted',
//           body: `Both sides have submitted payment for your ${challenge.amount} Birr challenge. Waiting on admin review.`,
//         },
//         conn
//       );
//     }

//     const [updatedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(updatedRows[0]);
//   });
// }

// async function markAdminReview(challengeId, adminId, approved) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (challenge.status !== 'ADMIN_REVIEW') {
//       throw new HttpError(422, 'Challenge is not pending admin review.');
//     }

//     if (!approved) {
//       await conn.query(`UPDATE challenges SET status = 'CANCELLED', payment_status_creator = 'REJECTED', payment_status_challenger = 'REJECTED', updated_at = NOW() WHERE id = ?`, [challenge.id]);

//       await notificationService.create(
//         {
//           userIds: [challenge.creator_id, challenge.challenger_id],
//           type: 'challenge_rejected',
//           title: 'Challenge payment rejected',
//           body: `Your ${challenge.amount} Birr challenge was rejected during admin review.`,
//         },
//         conn
//       );

//       const [cancelled] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//       return normalizeChallengeRow(cancelled[0]);
//     }

//     await conn.query(
//       `UPDATE challenges SET status = 'APPROVED', payment_status_creator = 'APPROVED', payment_status_challenger = 'APPROVED', approved_by = ?, approved_at = NOW(), updated_at = NOW() WHERE id = ?`,
//       [adminId, challenge.id]
//     );

//     await conn.query(
//       `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES
//          (?, 'challenge_payment', ?, ?),
//          (?, 'challenge_payment', ?, ?)`,
//       [challenge.creator_id, challenge.id, challenge.amount, challenge.challenger_id, challenge.id, challenge.amount]
//     );

//     const creatorTicket = `CR-${generateSeed().slice(0, 6)}`;
//     const challengerTicket = `CH-${generateSeed().slice(0, 6)}`;

//     await conn.query(
//       `UPDATE challenges
//          SET status = 'DRAW_SCHEDULED',
//              ticket_number_creator = ?,
//              ticket_number_challenger = ?,
//              draw_at = DATE_ADD(NOW(), INTERVAL ? MINUTE),
//              updated_at = NOW()
//        WHERE id = ?`,
//       [creatorTicket, challengerTicket, DRAW_DELAY_MINUTES, challenge.id]
//     );

//     await notificationService.create(
//       {
//         userIds: [challenge.creator_id, challenge.challenger_id],
//         type: 'challenge_numbers_assigned',
//         title: 'Your lottery numbers are ready',
//         body: `Payment confirmed for your ${challenge.amount} Birr challenge. Tickets: ${creatorTicket} / ${challengerTicket}. Draw runs in ${DRAW_DELAY_MINUTES} minutes.`,
//       },
//       conn
//     );

//     const [approvedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(approvedRows[0]);
//   });
// }

// async function approvePlayerPayment(challengeId, adminId, side, approved, reason) {
//   if (!['creator', 'challenger'].includes(side)) throw new HttpError(422, 'Invalid side.');

//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (challenge.status !== 'ADMIN_REVIEW') {
//       throw new HttpError(422, 'Challenge is not pending admin review.');
//     }

//     const paymentStatusField = side === 'creator' ? 'payment_status_creator' : 'payment_status_challenger';
//     const rejectionReasonField = side === 'creator' ? 'payment_rejection_reason_creator' : 'payment_rejection_reason_challenger';

//     if (approved) {
//       // Approve this side's payment
//       await conn.query(
//         `UPDATE challenges SET ${paymentStatusField} = 'APPROVED', ${rejectionReasonField} = NULL, updated_at = NOW() WHERE id = ?`,
//         [challenge.id]
//       );
//     } else {
//       // Reject this side's payment and store the reason
//       await conn.query(
//         `UPDATE challenges SET ${paymentStatusField} = 'REJECTED', ${rejectionReasonField} = ?, updated_at = NOW() WHERE id = ?`,
//         [reason || null, challenge.id]
//       );

//       // Notify the user that their payment was rejected
//       const rejectedUserId = side === 'creator' ? challenge.creator_id : challenge.challenger_id;
//       const otherUserId = side === 'creator' ? challenge.challenger_id : challenge.creator_id;
      
//       await notificationService.create({
//         userId: rejectedUserId,
//         type: 'payment_rejected',
//         title: 'Payment Rejected',
//         body: `Your payment for the ${challenge.amount} Birr challenge was rejected. Reason: ${reason || 'Not specified'}`,
//       }, conn);
//     }

//     // Fetch updated challenge to check both payment statuses
//     const [afterRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     const after = afterRows[0];

//     const bothApproved = after.payment_status_creator === 'APPROVED' && after.payment_status_challenger === 'APPROVED';
//     const bothRejected = after.payment_status_creator === 'REJECTED' && after.payment_status_challenger === 'REJECTED';

//     // Only auto-approve if both sides are approved
//     if (bothApproved) {
//       return markAdminReview(challengeId, adminId, true);
//     }

//     // If both sides rejected, cancel the challenge
//     if (bothRejected) {
//       await conn.query(`UPDATE challenges SET status = 'CANCELLED', updated_at = NOW() WHERE id = ?`, [challenge.id]);
//       await notificationService.create({
//         userIds: [challenge.creator_id, challenge.challenger_id],
//         type: 'challenge_rejected',
//         title: 'Challenge Cancelled',
//         body: `Your ${challenge.amount} Birr challenge was cancelled due to payment rejection(s).`,
//       }, conn);
//       const [cancelledRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//       return normalizeChallengeRow(cancelledRows[0]);
//     }

//     // Partial approval - return current state
//     return normalizeChallengeRow(after);
//   });
// }

// async function scheduleDraw(challengeId) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (!['APPROVED', 'DRAW_SCHEDULED'].includes(challenge.status)) {
//       throw new HttpError(422, 'Challenge is not approved for draw.');
//     }

//     await conn.query(
//       `UPDATE challenges
//          SET status = 'DRAW_SCHEDULED', draw_at = DATE_ADD(NOW(), INTERVAL ? MINUTE), updated_at = NOW()
//        WHERE id = ?`,
//       [DRAW_DELAY_MINUTES, challenge.id]
//     );

//     const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(updated[0]);
//   });
// }

// async function runDraw(challengeId) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (challenge.status !== 'DRAW_SCHEDULED') {
//       throw new HttpError(422, 'Challenge is not ready for draw.');
//     }
//     if (!challenge.challenger_id) {
//       throw new HttpError(422, 'No challenger assigned.');
//     }
//     if (!challenge.ticket_number_creator || !challenge.ticket_number_challenger) {
//       throw new HttpError(422, 'Ticket numbers were not assigned for this challenge.');
//     }

//     const participants = [
//       { userId: challenge.creator_id, ticket: challenge.ticket_number_creator },
//       { userId: challenge.challenger_id, ticket: challenge.ticket_number_challenger },
//     ];

//     const seed = generateSeed();
//     const winner = secureShuffle(participants)[0];

//     const totalPot = Number(challenge.amount) * 2;
//     const ratePercent = await settingsService.getCommissionRatePercent(conn);
//     const commissionAmount = Math.round(totalPot * (ratePercent / 100) * 100) / 100;
//     const netPayout = Math.round((totalPot - commissionAmount) * 100) / 100;

//     await conn.query(
//       `UPDATE challenges
//          SET status = 'DRAW_COMPLETED',
//              random_seed = ?,
//              winner_user_id = ?,
//              winner_ticket_number = ?,
//              commission_rate_percent = ?,
//              commission_amount = ?,
//              payout_net_amount = ?,
//              draw_at = NOW(),
//              updated_at = NOW()
//        WHERE id = ?`,
//       [seed, winner.userId, winner.ticket, ratePercent, commissionAmount, netPayout, challenge.id]
//     );

//     await notificationService.create(
//       {
//         userIds: [challenge.creator_id, challenge.challenger_id],
//         type: 'challenge_draw_completed',
//         title: 'Challenge draw completed',
//         body: `The ${challenge.amount} Birr challenge has completed. Winning ticket: ${winner.ticket}.`,
//       },
//       conn
//     );

//     const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(updated[0]);
//   });
// }

// async function requestPayout(userId, challengeId, { bankName, accountNumber, accountName }) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (!['DRAW_COMPLETED', 'PAYOUT_REVIEW'].includes(challenge.status)) {
//       throw new HttpError(422, 'Payout can only be requested after the draw completes or after a rejected payout review.');
//     }
//     if (Number(challenge.winner_user_id) !== Number(userId)) {
//       throw new HttpError(403, 'Only the winner can request payout.');
//     }
//     if (challenge.payout_status && challenge.payout_status !== 'rejected') {
//       throw new HttpError(422, 'A payout request is already in progress.');
//     }

//     await conn.query(
//       `UPDATE challenges
//          SET status = 'WINNER_REQUESTED_PAYOUT',
//              payout_status = 'waiting_payment',
//              payout_requested_at = NOW(),
//              bank_name = ?,
//              account_number = ?,
//              account_name = ?,
//              payout_rejection_reason = NULL,
//              updated_at = NOW()
//        WHERE id = ?`,
//       [bankName, accountNumber, accountName, challenge.id]
//     );

//     await notificationService.create(
//       {
//         userId,
//         type: 'payout_requested',
//         title: 'Payout requested',
//         body: `Your payout request for the ${challenge.amount} Birr challenge has been submitted.`,
//       },
//       conn
//     );

//     const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(updated[0]);
//   });
// }

// async function processPayout(challengeId, adminId, approved, { transactionId, screenshotPath, reason }) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
//     if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
//     const challenge = rows[0];

//     if (challenge.status !== 'WINNER_REQUESTED_PAYOUT') {
//       throw new HttpError(422, 'No payout request is pending for this challenge.');
//     }

//     if (!approved) {
//       await conn.query(
//         `UPDATE challenges
//            SET status = 'PAYOUT_REVIEW', payout_status = 'rejected', payout_rejection_reason = ?, updated_at = NOW()
//          WHERE id = ?`,
//         [reason || null, challenge.id]
//       );

//       await notificationService.create(
//         {
//           userId: challenge.winner_user_id,
//           type: 'payout_rejected',
//           title: 'Payout rejected',
//           body: `Your payout request was rejected${reason ? `: ${reason}` : '.'}`,
//         },
//         conn
//       );

//       const [rejected] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//       return normalizeChallengeRow(rejected[0]);
//     }

//     const netAmount = challenge.payout_net_amount !== null ? Number(challenge.payout_net_amount) : Number(challenge.amount);

//     await conn.query(
//       `UPDATE challenges
//          SET status = 'PAID',
//              payout_status = 'paid',
//              payout_transaction_id = ?,
//              payout_screenshot_path = ?,
//              payout_approved_by = ?,
//              payout_approved_at = NOW(),
//              updated_at = NOW()
//        WHERE id = ?`,
//       [transactionId, screenshotPath || null, adminId, challenge.id]
//     );

//     await conn.query(
//       `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'withdrawal', ?, ?)`,
//       [challenge.winner_user_id, challenge.id, netAmount]
//     );

//     await notificationService.create(
//       {
//         userId: challenge.winner_user_id,
//         type: 'payout_paid',
//         title: 'Payout paid',
//         body: `Your ${netAmount} Birr payout for the ${challenge.amount} Birr challenge has been processed.`,
//       },
//       conn
//     );

//     const [paid] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
//     return normalizeChallengeRow(paid[0]);
//   });
// }

// async function listAdminReviewChallenges() {
//   const [rows] = await pool.query(
//     `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
//      FROM challenges c
//      LEFT JOIN users u ON u.id = c.creator_id
//      LEFT JOIN users v ON v.id = c.challenger_id
//      WHERE c.status IN ('ADMIN_REVIEW', 'PAYMENT_PENDING', 'WINNER_REQUESTED_PAYOUT', 'PAYOUT_REVIEW')
//      AND (
//        c.status = 'ADMIN_REVIEW'
//        OR c.status = 'WINNER_REQUESTED_PAYOUT'
//        OR c.status = 'PAYOUT_REVIEW'
//        OR (c.status = 'PAYMENT_PENDING' AND (c.payment_reference_creator IS NOT NULL OR c.payment_reference_challenger IS NOT NULL))
//      )
//      ORDER BY c.updated_at DESC`
//   );
//   return rows.map((row) => ({
//     ...normalizeChallengeRow(row),
//     creatorName: row.creator_name,
//     challengerName: row.challenger_name,
//   }));
// }

// async function getFinanceReport() {
//   const [rows] = await pool.query(
//     `SELECT c.challenge_id, c.amount, c.commission_rate_percent, c.commission_amount,
//             c.payout_net_amount, c.updated_at, u.full_name AS winner_name
//      FROM challenges c
//      LEFT JOIN users u ON u.id = c.winner_user_id
//      WHERE c.status = 'PAID'
//      ORDER BY c.updated_at DESC`
//   );

//   const totals = rows.reduce(
//     (acc, row) => {
//       acc.totalPot += Number(row.amount) * 2;
//       acc.totalCommission += Number(row.commission_amount || 0);
//       acc.totalPaidOut += Number(row.payout_net_amount || 0);
//       return acc;
//     },
//     { totalPot: 0, totalCommission: 0, totalPaidOut: 0 }
//   );

//   return {
//     totals,
//     challenges: rows.map((row) => ({
//       challengeId: row.challenge_id,
//       totalPot: Number(row.amount) * 2,
//       commissionRatePercent: row.commission_rate_percent !== null ? Number(row.commission_rate_percent) : null,
//       commissionAmount: Number(row.commission_amount || 0),
//       payoutNetAmount: Number(row.payout_net_amount || 0),
//       winnerName: row.winner_name,
//       paidAt: row.updated_at,
//     })),
//   };
// }

// module.exports = {
//   VALID_STATUSES,
//   createChallenge,
//   listAvailableChallenges,
//   listUserChallenges,
//   getChallengeById,
//   acceptChallenge,
//   submitPaymentReference,
//   markAdminReview,
//   approvePlayerPayment,
//   scheduleDraw,
//   runDraw,
//   requestPayout,
//   processPayout,
//   listAdminReviewChallenges,
//   getFinanceReport,
// };

const { pool, withTransaction } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');
const { secureShuffle, generateSeed } = require('../../utils/random');
const notificationService = require('../notification/notification.service');
const settingsService = require('./settings.service');

const VALID_STATUSES = [
  'WAITING',
  'ACCEPTED',
  'PAYMENT_PENDING',
  'ADMIN_REVIEW',
  'APPROVED',
  'NUMBERS_ASSIGNED',
  'DRAW_SCHEDULED',
  'DRAW_COMPLETED',
  'WINNER_REQUESTED_PAYOUT',
  'PAYOUT_REVIEW',
  'PAID',
  'CANCELLED',
];

const DRAW_DELAY_MINUTES = 2;

function normalizeChallengeRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    challengeId: row.challenge_id,
    creatorId: row.creator_id,
    challengerId: row.challenger_id,
    amount: Number(row.amount),
    totalPot: Number(row.amount) * 2,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    // Creator payment info
    paymentReferenceCreator: row.payment_reference_creator,
    senderNameCreator: row.sender_name_creator,
    phoneCreator: row.phone_creator,
    screenshotCreator: row.screenshot_creator,
    paymentStatusCreator: row.payment_status_creator || 'PENDING',
    paymentRejectionReasonCreator: row.payment_rejection_reason_creator,

    // Challenger payment info
    paymentReferenceChallenger: row.payment_reference_challenger,
    senderNameChallenger: row.sender_name_challenger,
    phoneChallenger: row.phone_challenger,
    screenshotChallenger: row.screenshot_challenger,
    paymentStatusChallenger: row.payment_status_challenger || 'PENDING',
    paymentRejectionReasonChallenger: row.payment_rejection_reason_challenger,

    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    ticketNumberCreator: row.ticket_number_creator,
    ticketNumberChallenger: row.ticket_number_challenger,

    randomSeed: row.random_seed,
    winnerUserId: row.winner_user_id,
    winnerTicketNumber: row.winner_ticket_number,
    drawAt: row.draw_at,

    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name,
    payoutRequestedAt: row.payout_requested_at,
    payoutStatus: row.payout_status,
    payoutApprovedBy: row.payout_approved_by,
    payoutApprovedAt: row.payout_approved_at,
    payoutTransactionId: row.payout_transaction_id,
    payoutScreenshotPath: row.payout_screenshot_path,
    payoutRejectionReason: row.payout_rejection_reason,

    commissionRatePercent:
      row.commission_rate_percent !== null && row.commission_rate_percent !== undefined
        ? Number(row.commission_rate_percent)
        : null,
    commissionAmount:
      row.commission_amount !== null && row.commission_amount !== undefined
        ? Number(row.commission_amount)
        : null,
    payoutNetAmount:
      row.payout_net_amount !== null && row.payout_net_amount !== undefined
        ? Number(row.payout_net_amount)
        : null,
  };
}

async function validatePlayerEligibility(conn, userId) {
  const [rows] = await conn.query(`SELECT id FROM users WHERE id = ? LIMIT 1`, [userId]);
  if (!rows[0]) throw new HttpError(404, 'User not found.');
}

async function createChallenge(userId, { amount }) {
  const entryAmount = Number(amount);

  if (isNaN(entryAmount) || entryAmount <= 0) {
    throw new HttpError(422, 'Invalid challenge amount. Amount must be a positive number.');
  }

  await validatePlayerEligibility(pool, userId);

  const [result] = await pool.query(
    `INSERT INTO challenges (challenge_id, creator_id, amount, status)
     VALUES (?, ?, ?, 'WAITING')`,
    [generateSeed().slice(0, 12), userId, entryAmount]
  );

  const [rows] = await pool.query('SELECT * FROM challenges WHERE id = ?', [result.insertId]);
  const created = normalizeChallengeRow(rows[0]);

  try {
    const [users] = await pool.query('SELECT id, full_name FROM users WHERE id != ?', [userId]);
    const userIds = users.map((u) => u.id);
    const creatorName = (await pool.query('SELECT full_name FROM users WHERE id = ?', [userId]))[0][0].full_name;
    const message = `${creatorName} created a ${entryAmount} Birr challenge.`;

    await notificationService.create({
      userIds,
      type: 'challenge_created',
      title: 'New Challenge',
      body: message,
    });
  } catch (err) {
    console.error('[challenge] failed to notify users about new challenge:', err && err.message);
  }

  return created;
}

async function listAvailableChallenges(userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS creator_name
     FROM challenges c
     JOIN users u ON u.id = c.creator_id
     WHERE c.status = 'WAITING' AND c.creator_id != ?
     ORDER BY c.created_at ASC`,
    [userId]
  );
  return rows.map((row) => ({ ...normalizeChallengeRow(row), creatorName: row.creator_name }));
}

async function listUserChallenges(userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
     FROM challenges c
     LEFT JOIN users u ON u.id = c.creator_id
     LEFT JOIN users v ON v.id = c.challenger_id
     WHERE c.creator_id = ? OR c.challenger_id = ?
     ORDER BY c.created_at DESC`,
    [userId, userId]
  );
  return rows.map((row) => ({
    ...normalizeChallengeRow(row),
    creatorName: row.creator_name,
    challengerName: row.challenger_name,
  }));
}

async function getChallengeById(challengeId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
     FROM challenges c
     LEFT JOIN users u ON u.id = c.creator_id
     LEFT JOIN users v ON v.id = c.challenger_id
     WHERE c.challenge_id = ?
     LIMIT 1`,
    [challengeId]
  );
  if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
  return {
    ...normalizeChallengeRow(rows[0]),
    creatorName: rows[0].creator_name,
    challengerName: rows[0].challenger_name,
  };
}

async function acceptChallenge(userId, challengeId) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (challenge.creator_id === userId) {
      throw new HttpError(422, 'You cannot accept your own challenge.');
    }
    if (challenge.status !== 'WAITING') {
      throw new HttpError(422, 'Challenge is no longer available.');
    }

    await validatePlayerEligibility(conn, userId);
    await validatePlayerEligibility(conn, challenge.creator_id);

    await conn.query(
      `UPDATE challenges SET challenger_id = ?, status = 'ACCEPTED', updated_at = NOW() WHERE id = ?`,
      [userId, challenge.id]
    );

    await notificationService.create(
      {
        userId: challenge.creator_id,
        type: 'challenge_accepted',
        title: 'Your challenge was accepted',
        body: `A player has accepted your ${challenge.amount} Birr challenge. Complete payment to move forward.`,
      },
      conn
    );

    const [updatedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(updatedRows[0]);
  });
}

async function submitPaymentReference(userId, challengeId, { paymentReference, screenshotPath, senderName, phoneNumber }) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (!['ACCEPTED', 'PAYMENT_PENDING'].includes(challenge.status)) {
      throw new HttpError(422, 'Payments are not expected at this stage.');
    }
    if (![challenge.creator_id, challenge.challenger_id].includes(userId)) {
      throw new HttpError(403, 'You are not part of this challenge.');
    }

    const isCreator = userId === challenge.creator_id;
    const otherPaymentReference = isCreator
      ? challenge.payment_reference_challenger
      : challenge.payment_reference_creator;

    const paymentRefField = isCreator ? 'payment_reference_creator' : 'payment_reference_challenger';
    const screenshotField = isCreator ? 'screenshot_creator' : 'screenshot_challenger';
    const senderNameField = isCreator ? 'sender_name_creator' : 'sender_name_challenger';
    const phoneField = isCreator ? 'phone_creator' : 'phone_challenger';
    const paymentStatusField = isCreator ? 'payment_status_creator' : 'payment_status_challenger';

    const nextStatus = otherPaymentReference ? 'ADMIN_REVIEW' : 'PAYMENT_PENDING';

    await conn.query(
      `UPDATE challenges
         SET ${paymentRefField} = ?,
             ${screenshotField} = ?,
             ${senderNameField} = ?,
             ${phoneField} = ?,
             ${paymentStatusField} = 'SUBMITTED',
             status = ?,
             updated_at = NOW()
       WHERE id = ?`,
      [paymentReference, screenshotPath || null, senderName, phoneNumber, nextStatus, challenge.id]
    );

    if (nextStatus === 'ADMIN_REVIEW') {
      await notificationService.create(
        {
          userId: challenge.creator_id === userId ? challenge.challenger_id : challenge.creator_id,
          type: 'challenge_ready_for_review',
          title: 'Both payments submitted',
          body: `Both sides have submitted payment for your ${challenge.amount} Birr challenge. Waiting on admin review.`,
        },
        conn
      );
    }

    const [updatedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(updatedRows[0]);
  });
}

/**
 * Core admin-review logic, factored out so it can run either:
 *  - standalone, opening its own transaction (externalConn not supplied), or
 *  - as part of an already-open transaction (externalConn supplied), which is
 *    required when this is invoked from approvePlayerPayment() below — reusing
 *    the SAME connection avoids taking a second `FOR UPDATE` lock on a row that
 *    the outer transaction already holds (which previously caused a deadlock /
 *    lock-wait timeout and made the second side's "Approve" button fail with a
 *    generic error).
 */
async function markAdminReviewLogic(conn, challengeId, adminId, approved, reason) {
  const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
  if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
  const challenge = rows[0];

  if (challenge.status !== 'ADMIN_REVIEW') {
    throw new HttpError(422, 'Challenge is not pending admin review.');
  }

  if (!approved) {
    await conn.query(
      `UPDATE challenges
         SET status = 'CANCELLED',
             payment_status_creator = 'REJECTED',
             payment_status_challenger = 'REJECTED',
             payment_rejection_reason_creator = ?,
             payment_rejection_reason_challenger = ?,
             updated_at = NOW()
       WHERE id = ?`,
      [reason || null, reason || null, challenge.id]
    );

    await notificationService.create(
      {
        userIds: [challenge.creator_id, challenge.challenger_id],
        type: 'challenge_rejected',
        title: 'Challenge payment rejected',
        body: `Your ${challenge.amount} Birr challenge was rejected during admin review.${reason ? ` Reason: ${reason}` : ''}`,
      },
      conn
    );

    const [cancelled] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(cancelled[0]);
  }

  await conn.query(
    `UPDATE challenges
       SET status = 'APPROVED',
           payment_status_creator = 'APPROVED',
           payment_status_challenger = 'APPROVED',
           approved_by = ?,
           approved_at = NOW(),
           updated_at = NOW()
     WHERE id = ?`,
    [adminId, challenge.id]
  );

  await conn.query(
    `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES
       (?, 'challenge_payment', ?, ?),
       (?, 'challenge_payment', ?, ?)`,
    [challenge.creator_id, challenge.id, challenge.amount, challenge.challenger_id, challenge.id, challenge.amount]
  );

  const creatorTicket = `CR-${generateSeed().slice(0, 6)}`;
  const challengerTicket = `CH-${generateSeed().slice(0, 6)}`;

  await conn.query(
    `UPDATE challenges
       SET status = 'DRAW_SCHEDULED',
           ticket_number_creator = ?,
           ticket_number_challenger = ?,
           draw_at = DATE_ADD(NOW(), INTERVAL ? MINUTE),
           updated_at = NOW()
     WHERE id = ?`,
    [creatorTicket, challengerTicket, DRAW_DELAY_MINUTES, challenge.id]
  );

  await notificationService.create(
    {
      userIds: [challenge.creator_id, challenge.challenger_id],
      type: 'challenge_numbers_assigned',
      title: 'Your lottery numbers are ready',
      body: `Payment confirmed for your ${challenge.amount} Birr challenge. Tickets: ${creatorTicket} / ${challengerTicket}. Draw runs in ${DRAW_DELAY_MINUTES} minutes.`,
    },
    conn
  );

  const [approvedRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
  return normalizeChallengeRow(approvedRows[0]);
}

async function markAdminReview(challengeId, adminId, approved, reason, externalConn) {
  if (externalConn) {
    // Reuse the caller's connection/transaction — do NOT open a new one.
    return markAdminReviewLogic(externalConn, challengeId, adminId, approved, reason);
  }
  return withTransaction((conn) => markAdminReviewLogic(conn, challengeId, adminId, approved, reason));
}

async function approvePlayerPayment(challengeId, adminId, side, approved, reason) {
  if (!['creator', 'challenger'].includes(side)) throw new HttpError(422, 'Invalid side.');

  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (!['ADMIN_REVIEW', 'PAYMENT_PENDING'].includes(challenge.status)) {
      throw new HttpError(422, 'Challenge is not pending payment review.');
    }

    const paymentStatusField = side === 'creator' ? 'payment_status_creator' : 'payment_status_challenger';
    const rejectionReasonField =
      side === 'creator' ? 'payment_rejection_reason_creator' : 'payment_rejection_reason_challenger';

    if (approved) {
      await conn.query(
        `UPDATE challenges SET ${paymentStatusField} = 'APPROVED', ${rejectionReasonField} = NULL, updated_at = NOW() WHERE id = ?`,
        [challenge.id]
      );

      // Notify the approved player
      const approvedUserId = side === 'creator' ? challenge.creator_id : challenge.challenger_id;
      await notificationService.create(
        {
          userId: approvedUserId,
          type: 'payment_approved',
          title: 'Payment Approved',
          body: `Your payment for the ${challenge.amount} Birr challenge has been approved.`,
        },
        conn
      );
    } else {
      await conn.query(
        `UPDATE challenges SET ${paymentStatusField} = 'REJECTED', ${rejectionReasonField} = ?, updated_at = NOW() WHERE id = ?`,
        [reason || null, challenge.id]
      );

      const rejectedUserId = side === 'creator' ? challenge.creator_id : challenge.challenger_id;
      await notificationService.create(
        {
          userId: rejectedUserId,
          type: 'payment_rejected',
          title: 'Payment Rejected',
          body: `Your payment for the ${challenge.amount} Birr challenge was rejected. Reason: ${reason || 'Not specified'}`,
        },
        conn
      );
    }

    // Fetch updated challenge to check both payment statuses
    const [afterRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    const after = afterRows[0];

    const bothApproved =
      after.payment_status_creator === 'APPROVED' && after.payment_status_challenger === 'APPROVED';
    const eitherRejected =
      after.payment_status_creator === 'REJECTED' || after.payment_status_challenger === 'REJECTED';

    // Auto-approve (generate tickets) when both sides are approved.
    // IMPORTANT: pass the current `conn` through so this runs inside the SAME
    // transaction instead of opening a second one (which previously deadlocked
    // against the FOR UPDATE lock taken above and made the 2nd approval fail).
    if (bothApproved) {
      // If the challenge hasn't reached ADMIN_REVIEW status yet (e.g. an admin
      // approved a side before both payment references were submitted), bump
      // it to ADMIN_REVIEW first so markAdminReviewLogic's guard passes.
      if (after.status !== 'ADMIN_REVIEW') {
        await conn.query(`UPDATE challenges SET status = 'ADMIN_REVIEW', updated_at = NOW() WHERE id = ?`, [
          challenge.id,
        ]);
      }
      return markAdminReviewLogic(conn, challengeId, adminId, true, null);
    }

    // If either side is rejected, cancel the entire challenge
    if (eitherRejected) {
      const cancelReason =
        after.payment_status_creator === 'REJECTED'
          ? after.payment_rejection_reason_creator
          : after.payment_rejection_reason_challenger;

      await conn.query(
        `UPDATE challenges
           SET status = 'CANCELLED',
               payment_status_creator = CASE WHEN payment_status_creator != 'REJECTED' THEN 'CANCELLED' ELSE payment_status_creator END,
               payment_status_challenger = CASE WHEN payment_status_challenger != 'REJECTED' THEN 'CANCELLED' ELSE payment_status_challenger END,
               updated_at = NOW()
         WHERE id = ?`,
        [challenge.id]
      );

      await notificationService.create(
        {
          userIds: [challenge.creator_id, challenge.challenger_id].filter(Boolean),
          type: 'challenge_cancelled',
          title: 'Challenge Cancelled',
          body: `Your ${challenge.amount} Birr challenge was cancelled due to a payment rejection.${cancelReason ? ` Reason: ${cancelReason}` : ''}`,
        },
        conn
      );

      const [cancelledRows] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
      return normalizeChallengeRow(cancelledRows[0]);
    }

    // Partial — one side reviewed, one still pending
    return normalizeChallengeRow(after);
  });
}

async function scheduleDraw(challengeId) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (!['APPROVED', 'DRAW_SCHEDULED'].includes(challenge.status)) {
      throw new HttpError(422, 'Challenge is not approved for draw.');
    }

    await conn.query(
      `UPDATE challenges
         SET status = 'DRAW_SCHEDULED', draw_at = DATE_ADD(NOW(), INTERVAL ? MINUTE), updated_at = NOW()
       WHERE id = ?`,
      [DRAW_DELAY_MINUTES, challenge.id]
    );

    const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(updated[0]);
  });
}

async function runDraw(challengeId) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (challenge.status !== 'DRAW_SCHEDULED') {
      throw new HttpError(422, 'Challenge is not ready for draw.');
    }
    if (!challenge.challenger_id) {
      throw new HttpError(422, 'No challenger assigned.');
    }
    if (!challenge.ticket_number_creator || !challenge.ticket_number_challenger) {
      throw new HttpError(422, 'Ticket numbers were not assigned for this challenge.');
    }

    const participants = [
      { userId: challenge.creator_id, ticket: challenge.ticket_number_creator },
      { userId: challenge.challenger_id, ticket: challenge.ticket_number_challenger },
    ];

    const seed = generateSeed();
    const winner = secureShuffle(participants)[0];

    const totalPot = Number(challenge.amount) * 2;
    const ratePercent = await settingsService.getCommissionRatePercent(conn);
    const commissionAmount = Math.round(totalPot * (ratePercent / 100) * 100) / 100;
    const netPayout = Math.round((totalPot - commissionAmount) * 100) / 100;

    await conn.query(
      `UPDATE challenges
         SET status = 'DRAW_COMPLETED',
             random_seed = ?,
             winner_user_id = ?,
             winner_ticket_number = ?,
             commission_rate_percent = ?,
             commission_amount = ?,
             payout_net_amount = ?,
             draw_at = NOW(),
             updated_at = NOW()
       WHERE id = ?`,
      [seed, winner.userId, winner.ticket, ratePercent, commissionAmount, netPayout, challenge.id]
    );

    await notificationService.create(
      {
        userIds: [challenge.creator_id, challenge.challenger_id],
        type: 'challenge_draw_completed',
        title: 'Challenge draw completed',
        body: `The ${challenge.amount} Birr challenge has completed. Winning ticket: ${winner.ticket}.`,
      },
      conn
    );

    const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(updated[0]);
  });
}

async function requestPayout(userId, challengeId, { bankName, accountNumber, accountName }) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (!['DRAW_COMPLETED', 'PAYOUT_REVIEW'].includes(challenge.status)) {
      throw new HttpError(422, 'Payout can only be requested after the draw completes or after a rejected payout review.');
    }
    if (Number(challenge.winner_user_id) !== Number(userId)) {
      throw new HttpError(403, 'Only the winner can request payout.');
    }
    if (challenge.payout_status && challenge.payout_status !== 'rejected') {
      throw new HttpError(422, 'A payout request is already in progress.');
    }

    await conn.query(
      `UPDATE challenges
         SET status = 'WINNER_REQUESTED_PAYOUT',
             payout_status = 'waiting_payment',
             payout_requested_at = NOW(),
             bank_name = ?,
             account_number = ?,
             account_name = ?,
             payout_rejection_reason = NULL,
             updated_at = NOW()
       WHERE id = ?`,
      [bankName, accountNumber, accountName, challenge.id]
    );

    await notificationService.create(
      {
        userId,
        type: 'payout_requested',
        title: 'Payout requested',
        body: `Your payout request for the ${challenge.amount} Birr challenge has been submitted.`,
      },
      conn
    );

    const [updated] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(updated[0]);
  });
}

async function processPayout(challengeId, adminId, approved, { transactionId, screenshotPath, reason }) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM challenges WHERE challenge_id = ? FOR UPDATE', [challengeId]);
    if (!rows[0]) throw new HttpError(404, 'Challenge not found.');
    const challenge = rows[0];

    if (challenge.status !== 'WINNER_REQUESTED_PAYOUT') {
      throw new HttpError(422, 'No payout request is pending for this challenge.');
    }

    if (!approved) {
      await conn.query(
        `UPDATE challenges
           SET status = 'PAYOUT_REVIEW', payout_status = 'rejected', payout_rejection_reason = ?, updated_at = NOW()
         WHERE id = ?`,
        [reason || null, challenge.id]
      );

      await notificationService.create(
        {
          userId: challenge.winner_user_id,
          type: 'payout_rejected',
          title: 'Payout rejected',
          body: `Your payout request was rejected${reason ? `: ${reason}` : '.'}`,
        },
        conn
      );

      const [rejected] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
      return normalizeChallengeRow(rejected[0]);
    }

    const netAmount =
      challenge.payout_net_amount !== null ? Number(challenge.payout_net_amount) : Number(challenge.amount);

    await conn.query(
      `UPDATE challenges
         SET status = 'PAID',
             payout_status = 'paid',
             payout_transaction_id = ?,
             payout_screenshot_path = ?,
             payout_approved_by = ?,
             payout_approved_at = NOW(),
             updated_at = NOW()
       WHERE id = ?`,
      [transactionId, screenshotPath || null, adminId, challenge.id]
    );

    await conn.query(
      `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'withdrawal', ?, ?)`,
      [challenge.winner_user_id, challenge.id, netAmount]
    );

    await notificationService.create(
      {
        userId: challenge.winner_user_id,
        type: 'payout_paid',
        title: 'Payout paid',
        body: `Your ${netAmount} Birr payout for the ${challenge.amount} Birr challenge has been processed.`,
      },
      conn
    );

    const [paid] = await conn.query('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
    return normalizeChallengeRow(paid[0]);
  });
}

async function listAdminReviewChallenges() {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS creator_name, v.full_name AS challenger_name
     FROM challenges c
     LEFT JOIN users u ON u.id = c.creator_id
     LEFT JOIN users v ON v.id = c.challenger_id
     WHERE c.status IN ('ADMIN_REVIEW', 'PAYMENT_PENDING', 'WINNER_REQUESTED_PAYOUT', 'PAYOUT_REVIEW')
     AND (
       c.status = 'ADMIN_REVIEW'
       OR c.status = 'WINNER_REQUESTED_PAYOUT'
       OR c.status = 'PAYOUT_REVIEW'
       OR (
         c.status = 'PAYMENT_PENDING'
         AND (c.payment_reference_creator IS NOT NULL OR c.payment_reference_challenger IS NOT NULL)
       )
     )
     ORDER BY c.updated_at DESC`
  );
  return rows.map((row) => ({
    ...normalizeChallengeRow(row),
    creatorName: row.creator_name,
    challengerName: row.challenger_name,
  }));
}

async function getFinanceReport() {
  const [rows] = await pool.query(
    `SELECT c.challenge_id, c.amount, c.commission_rate_percent, c.commission_amount,
            c.payout_net_amount, c.updated_at, u.full_name AS winner_name
     FROM challenges c
     LEFT JOIN users u ON u.id = c.winner_user_id
     WHERE c.status = 'PAID'
     ORDER BY c.updated_at DESC`
  );

  const totals = rows.reduce(
    (acc, row) => {
      acc.totalPot += Number(row.amount) * 2;
      acc.totalCommission += Number(row.commission_amount || 0);
      acc.totalPaidOut += Number(row.payout_net_amount || 0);
      return acc;
    },
    { totalPot: 0, totalCommission: 0, totalPaidOut: 0 }
  );

  return {
    totals,
    challenges: rows.map((row) => ({
      challengeId: row.challenge_id,
      totalPot: Number(row.amount) * 2,
      commissionRatePercent: row.commission_rate_percent !== null ? Number(row.commission_rate_percent) : null,
      commissionAmount: Number(row.commission_amount || 0),
      payoutNetAmount: Number(row.payout_net_amount || 0),
      winnerName: row.winner_name,
      paidAt: row.updated_at,
    })),
  };
}

module.exports = {
  VALID_STATUSES,
  createChallenge,
  listAvailableChallenges,
  listUserChallenges,
  getChallengeById,
  acceptChallenge,
  submitPaymentReference,
  markAdminReview,
  approvePlayerPayment,
  scheduleDraw,
  runDraw,
  requestPayout,
  processPayout,
  listAdminReviewChallenges,
  getFinanceReport,
};