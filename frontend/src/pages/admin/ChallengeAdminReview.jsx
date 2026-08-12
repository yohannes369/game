

// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// // Mirrors backend status definitions
// const STATUS = {
//   PAYMENT_PENDING: 'PAYMENT_PENDING',
//   AWAITING_ADMIN_APPROVAL: 'ADMIN_REVIEW',
//   APPROVED: 'APPROVED',
//   PAYOUT_PENDING: 'WINNER_REQUESTED_PAYOUT',
//   PAYOUT_REJECTED: 'PAYOUT_REVIEW',
//   COMPLETED: 'PAID',
// };

// const PAYMENT_STATUS = {
//   PENDING: 'PENDING',
//   APPROVED: 'APPROVED',
//   REJECTED: 'REJECTED',
// };

// function formatDate(dateString) {
//   return dateString ? new Date(dateString).toLocaleString() : '—';
// }

// function PaymentStatusPill({ status }) {
//   const colorMap = {
//     [PAYMENT_STATUS.PENDING]: 'bg-gray-100 text-gray-700',
//     [PAYMENT_STATUS.APPROVED]: 'bg-green-100 text-green-700',
//     [PAYMENT_STATUS.REJECTED]: 'bg-red-100 text-red-700',
//   };
//   const labels = {
//     [PAYMENT_STATUS.PENDING]: 'Pending',
//     [PAYMENT_STATUS.APPROVED]: 'Approved',
//     [PAYMENT_STATUS.REJECTED]: 'Rejected',
//   };
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
//       {labels[status] || status}
//     </span>
//   );
// }

// function PaymentSideCard({ t, label, reference, senderName, phone, status, rejectionReason, busy, onApprove, onReject }) {
//   const [reason, setReason] = useState('');
//   const locked = status === PAYMENT_STATUS.APPROVED || status === PAYMENT_STATUS.REJECTED;

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
//         <PaymentStatusPill status={status} />
//       </div>
//       <p className="mt-2 text-sm font-medium text-gray-900">{reference || t('challenge.notSubmitted', 'Not submitted')}</p>
//       {senderName && (
//         <p className="mt-1 text-xs text-gray-500">{senderName} · {phone}</p>
//       )}

//       {rejectionReason && status === PAYMENT_STATUS.REJECTED && (
//         <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2">
//           <p className="text-xs font-medium text-red-700">{t('challenge.rejectionReason', 'Rejection reason')}:</p>
//           <p className="text-xs text-red-600">{rejectionReason}</p>
//         </div>
//       )}

//       {reference && !locked && (
//         <div className="mt-3 space-y-2">
//           <input
//             type="text"
//             value={reason}
//             onChange={(event) => setReason(event.target.value)}
//             placeholder={t('challenge.rejectionReasonPlaceholder', 'Rejection reason (optional)')}
//             className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//           />
//           <div className="flex gap-2">
//             <button
//               type="button"
//               disabled={busy}
//               onClick={() => onReject(reason)}
//               className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {t('challenge.reject', 'Reject')}
//             </button>
//             <button
//               type="button"
//               disabled={busy}
//               onClick={() => onApprove()}
//               className="flex-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {t('challenge.approve', 'Approve')}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ChallengeAdminReview() {
//   const { t } = useTranslation();
//   const [challenges, setChallenges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [actionId, setActionId] = useState(null);

//   const [payoutForms, setPayoutForms] = useState({});

//   async function fetchChallenges() {
//     setLoading(true);
//     setError('');
//     try {
//       const { data } = await api.get('/challenges/admin/review');
//       setChallenges(data.challenges || []);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchChallenges();
//   }, []);

//   async function handlePaymentSideReview(challengeId, side, approved, reason) {
//     setActionId(`${challengeId}:${side}`);
//     setError('');
//     try {
//       await api.patch(`/challenges/${challengeId}/admin/payment/${side}`, {
//         approved,
//         reason: reason || undefined,
//       });
//       await fetchChallenges();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setActionId(null);
//     }
//   }

//   async function handleApproveChallenge(challengeId) {
//     setActionId(challengeId);
//     setError('');
//     try {
//       await api.post(`/challenges/${challengeId}/admin/approve`);
//       await fetchChallenges();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setActionId(null);
//     }
//   }

//   async function handleRejectChallenge(challengeId) {
//     const reason = window.prompt(t('challenge.rejectChallengeReasonPrompt', 'Reason for rejecting this challenge:'));
//     if (reason === null) return;
//     setActionId(challengeId);
//     setError('');
//     try {
//       await api.post(`/challenges/${challengeId}/admin/reject`, { reason });
//       await fetchChallenges();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setActionId(null);
//     }
//   }

//   function updatePayoutForm(challengeId, field, value) {
//     setPayoutForms((prev) => ({
//       ...prev,
//       [challengeId]: { ...prev[challengeId], [field]: value },
//     }));
//   }

//   async function handleApprovePayout(challengeId) {
//     const form = payoutForms[challengeId] || {};
//     if (!form.transactionId || !form.screenshot) {
//       setError(t('challenge.payoutApprovalFieldsRequired', 'A transaction ID and proof screenshot are required to mark this payout as paid.'));
//       return;
//     }
//     setActionId(challengeId);
//     setError('');
//     try {
//       const formData = new FormData();
//       formData.append('approved', 'true');
//       formData.append('transactionId', form.transactionId);
//       formData.append('screenshot', form.screenshot);

//       await api.patch(`/challenges/${challengeId}/admin/payout`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setPayoutForms((prev) => ({ ...prev, [challengeId]: {} }));
//       await fetchChallenges();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setActionId(null);
//     }
//   }

//   async function handleRejectPayout(challengeId) {
//     const form = payoutForms[challengeId] || {};
//     if (!form.reason) {
//       setError(t('challenge.payoutRejectionReasonRequired', 'A rejection reason is required.'));
//       return;
//     }
//     setActionId(challengeId);
//     setError('');
//     try {
//       await api.patch(`/challenges/${challengeId}/admin/payout`, {
//         approved: false,
//         reason: form.reason,
//       });
//       setPayoutForms((prev) => ({ ...prev, [challengeId]: {} }));
//       await fetchChallenges();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setActionId(null);
//     }
//   }

//   // FIX: Include challenges that are ADMIN_REVIEW OR PAYMENT_PENDING (where at least 1 side has paid)
//   const reviewQueue = challenges.filter(
//     (c) =>
//       c.status === STATUS.AWAITING_ADMIN_APPROVAL ||
//       (c.status === STATUS.PAYMENT_PENDING && (c.paymentReferenceCreator || c.paymentReferenceChallenger))
//   );

//   const payoutQueue = challenges.filter(
//     (c) => c.status === STATUS.PAYOUT_PENDING || c.status === STATUS.PAYOUT_REJECTED
//   );

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900">{t('challenge.adminReviewTitle', 'Challenge Review')}</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             {t('challenge.adminReviewSubtitle', 'Approve or reject pending challenge payment submissions from players.')}
//           </p>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
//       )}

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, index) => (
//             <div key={index} className="h-28 rounded-3xl bg-gray-100 animate-pulse" />
//           ))}
//         </div>
//       ) : (
//         <>
//           <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('challenge.paymentReviewQueue', 'Payment Review')}</h2>
//           {reviewQueue.length === 0 ? (
//             <div className="mb-10 rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
//               {t('challenge.adminReviewEmpty', 'No challenge reviews are currently pending.')}
//             </div>
//           ) : (
//             <div className="mb-10 space-y-6">
//               {reviewQueue.map((challenge) => {
//                 const bothApproved =
//                   challenge.paymentStatusCreator === PAYMENT_STATUS.APPROVED &&
//                   challenge.paymentStatusChallenger === PAYMENT_STATUS.APPROVED;

//                 const hasOnePayment =
//                   Boolean(challenge.paymentReferenceCreator) !== Boolean(challenge.paymentReferenceChallenger);

//                 return (
//                   <div key={challenge.challengeId} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//                     <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//                       <div className="space-y-2">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
//                             hasOnePayment ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
//                           }`}>
//                             {hasOnePayment ? 'PARTIAL PAYMENT (1/2)' : challenge.status}
//                           </span>
//                           <span className="text-sm text-gray-500">{challenge.challengeId}</span>
//                         </div>
//                         <div className="grid gap-2 sm:grid-cols-4">
//                           <div>
//                             <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.amount', 'Entry')}</p>
//                             <p className="mt-1 font-semibold text-gray-900">{challenge.amount} Birr</p>
//                           </div>
//                           <div>
//                             <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.totalPot', 'Total Pot')}</p>
//                             <p className="mt-1 font-semibold text-gray-900">{challenge.totalPot} Birr</p>
//                           </div>
//                           <div>
//                             <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.creator', 'Creator')}</p>
//                             <p className="mt-1 text-gray-900">{challenge.creatorName || '-'}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.challenger', 'Challenger')}</p>
//                             <p className="mt-1 text-gray-900">{challenge.challengerName || '-'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col gap-3 sm:items-end">
//                         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.updatedAt', 'Updated')}</p>
//                         <p className="font-medium text-gray-700">{formatDate(challenge.updatedAt)}</p>
//                       </div>
//                     </div>

//                     <div className="mt-6 grid gap-4 lg:grid-cols-2">
//                       <PaymentSideCard
//                         t={t}
//                         label={t('challenge.creatorPayment', 'Creator payment')}
//                         reference={challenge.paymentReferenceCreator}
//                         senderName={challenge.senderNameCreator}
//                         phone={challenge.phoneCreator}
//                         status={challenge.paymentStatusCreator}
//                         rejectionReason={challenge.paymentRejectionReasonCreator}
//                         busy={actionId === `${challenge.challengeId}:creator`}
//                         onApprove={() => handlePaymentSideReview(challenge.challengeId, 'creator', true)}
//                         onReject={(reason) => handlePaymentSideReview(challenge.challengeId, 'creator', false, reason)}
//                       />
//                       <PaymentSideCard
//                         t={t}
//                         label={t('challenge.challengerPayment', 'Challenger payment')}
//                         reference={challenge.paymentReferenceChallenger}
//                         senderName={challenge.senderNameChallenger}
//                         phone={challenge.phoneChallenger}
//                         status={challenge.paymentStatusChallenger}
//                         rejectionReason={challenge.paymentRejectionReasonChallenger}
//                         busy={actionId === `${challenge.challengeId}:challenger`}
//                         onApprove={() => handlePaymentSideReview(challenge.challengeId, 'challenger', true)}
//                         onReject={(reason) => handlePaymentSideReview(challenge.challengeId, 'challenger', false, reason)}
//                       />
//                     </div>

//                     <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
//                       {!bothApproved && (challenge.paymentStatusCreator === PAYMENT_STATUS.PENDING || challenge.paymentStatusChallenger === PAYMENT_STATUS.PENDING) && (
//                         <div className="flex-1 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
//                           {t('challenge.approveEachPayment', 'Approve each payment above to continue')}
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => handleRejectChallenge(challenge.challengeId)}
//                         disabled={actionId === challenge.challengeId}
//                         className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
//                       >
//                         {t('challenge.rejectChallenge', 'Reject Challenge')}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => handleApproveChallenge(challenge.challengeId)}
//                         disabled={!bothApproved || actionId === challenge.challengeId}
//                         title={!bothApproved ? t('challenge.bothSidesRequired', 'Both payment sides must be approved first') : undefined}
//                         className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
//                       >
//                         {actionId === challenge.challengeId
//                           ? t('common.processing', 'Processing...')
//                           : t('challenge.approveChallenge', 'Approve Challenge & Issue Tickets')}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('challenge.payoutQueue', 'Payout Requests')}</h2>
//           {payoutQueue.length === 0 ? (
//             <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
//               {t('challenge.payoutQueueEmpty', 'No payout requests are currently pending.')}
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {payoutQueue.map((challenge) => {
//                 const form = payoutForms[challenge.challengeId] || {};
//                 const busy = actionId === challenge.challengeId;
//                 const alreadyPaid = challenge.status === STATUS.COMPLETED;

//                 return (
//                   <div key={challenge.challengeId} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
//                           challenge.status === STATUS.PAYOUT_REJECTED
//                             ? 'bg-red-100 text-red-700'
//                             : 'bg-cyan-100 text-cyan-700'
//                         }`}
//                       >
//                         {challenge.status}
//                       </span>
//                       <span className="text-sm text-gray-500">{challenge.challengeId}</span>
//                     </div>

//                     {challenge.status === STATUS.PAYOUT_REJECTED && challenge.payoutRejectionReason && (
//                       <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//                         {t('challenge.previousRejectionReason', 'Previously rejected')}: {challenge.payoutRejectionReason}
//                       </p>
//                     )}

//                     <div className="mt-4 grid gap-4 sm:grid-cols-3">
//                       <div>
//                         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.winnerTicket', 'Winning Ticket')}</p>
//                         <p className="mt-1 font-semibold text-gray-900">{challenge.winnerTicketNumber}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.totalPot', 'Total Pot')}</p>
//                         <p className="mt-1 font-semibold text-gray-900">{challenge.totalPot} Birr</p>
//                       </div>
//                       <div>
//                         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.payoutNet', 'Net Payout')}</p>
//                         <p className="mt-1 font-semibold text-gray-900">{challenge.payoutNetAmount ?? '—'} Birr</p>
//                       </div>
//                     </div>
//                     <p className="mt-4 text-sm text-gray-600">
//                       {t('challenge.payoutBank', 'Bank')}: {challenge.bankName} · {challenge.accountNumber} · {challenge.accountName}
//                     </p>

//                     {alreadyPaid ? (
//                       <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
//                         <p className="text-sm font-semibold text-emerald-800">
//                           {t('challenge.userPaidStatus', 'Winner has been paid')}
//                         </p>
//                         {challenge.payoutTransactionId && (
//                           <p className="mt-1 text-xs text-emerald-700">
//                             {t('challenge.transactionId', 'Transaction ID')}: {challenge.payoutTransactionId}
//                           </p>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="mt-6 grid gap-4 sm:grid-cols-2">
//                         <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('challenge.markAsPaid', 'Mark as Paid')}</p>
//                           <label className="mt-3 block text-xs font-medium text-gray-600">{t('challenge.transactionId', 'Transaction ID')}</label>
//                           <input
//                             type="text"
//                             value={form.transactionId || ''}
//                             onChange={(event) => updatePayoutForm(challenge.challengeId, 'transactionId', event.target.value)}
//                             placeholder={t('challenge.transactionIdPlaceholder', 'Bank transaction ID')}
//                             className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
//                           />
//                           <label className="mt-3 block text-xs font-medium text-gray-600">{t('challenge.proofScreenshot', 'Proof of transfer (screenshot)')}</label>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(event) => updatePayoutForm(challenge.challengeId, 'screenshot', event.target.files?.[0] || null)}
//                             className="mt-1 text-xs"
//                           />
//                           <button
//                             type="button"
//                             disabled={busy || !form.transactionId || !form.screenshot}
//                             onClick={() => handleApprovePayout(challenge.challengeId)}
//                             className="mt-4 w-full rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
//                           >
//                             {busy ? t('common.processing', 'Processing...') : t('challenge.confirmPayoutSent', 'Confirm Payout Sent')}
//                           </button>
//                         </div>

//                         <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('challenge.rejectPayout', 'Reject Payout')}</p>
//                           <textarea
//                             value={form.reason || ''}
//                             onChange={(event) => updatePayoutForm(challenge.challengeId, 'reason', event.target.value)}
//                             placeholder={t('challenge.rejectionReasonPlaceholder', 'Reason (required)')}
//                             rows={3}
//                             className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
//                           />
//                           <button
//                             type="button"
//                             disabled={busy || !form.reason}
//                             onClick={() => handleRejectPayout(challenge.challengeId)}
//                             className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
//                           >
//                             {busy ? t('common.processing', 'Processing...') : t('challenge.rejectPayoutButton', 'Reject Payout')}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

// ─── Status constants ────────────────────────────────────────
const STATUS = {
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  ADMIN_REVIEW: 'ADMIN_REVIEW',
  PAYOUT_PENDING: 'WINNER_REQUESTED_PAYOUT',
  PAYOUT_REJECTED: 'PAYOUT_REVIEW',
  COMPLETED: 'PAID',
};

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

// ─── Helpers ────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-ET', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Payment status pill ────────────────────────────────────
function PaymentStatusPill({ status }) {
  const map = {
    [PAYMENT_STATUS.PENDING]: {
      cls: 'bg-gray-100 text-gray-600 border-gray-200',
      icon: '○',
      label: 'Not submitted',
    },
    [PAYMENT_STATUS.SUBMITTED]: {
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '◎',
      label: 'Awaiting review',
    },
    [PAYMENT_STATUS.APPROVED]: {
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '✓',
      label: 'Approved',
    },
    [PAYMENT_STATUS.REJECTED]: {
      cls: 'bg-red-50 text-red-700 border-red-200',
      icon: '✕',
      label: 'Rejected',
    },
    [PAYMENT_STATUS.CANCELLED]: {
      cls: 'bg-gray-100 text-gray-500 border-gray-200',
      icon: '—',
      label: 'Cancelled',
    },
  };
  const { cls, icon, label } = map[status] || map[PAYMENT_STATUS.PENDING];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      <span className="text-[10px] leading-none">{icon}</span>
      {label}
    </span>
  );
}

// ─── Challenge-level status badge ───────────────────────────
function ChallengeBadge({ challenge }) {
  const hasCreator = Boolean(challenge.paymentReferenceCreator);
  const hasChallenger = Boolean(challenge.paymentReferenceChallenger);
  const paidCount = [hasCreator, hasChallenger].filter(Boolean).length;

  if (challenge.status === STATUS.ADMIN_REVIEW) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
        Both paid · Needs review
      </span>
    );
  }
  if (challenge.status === STATUS.PAYMENT_PENDING) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        {paidCount}/2 paid · Waiting
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
      {challenge.status}
    </span>
  );
}

// ─── Individual player payment card ─────────────────────────
function PlayerPaymentCard({
  t,
  role,               // 'creator' | 'challenger'
  playerName,
  reference,
  senderName,
  phone,
  screenshot,
  status,
  rejectionReason,
  busy,
  locked,             // true when already APPROVED or REJECTED
  onApprove,
  onReject,
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isCreator = role === 'creator';
  const roleLabel = isCreator ? 'Creator' : 'Challenger';
  const roleColor = isCreator
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-cyan-50 text-cyan-700 border-cyan-200';

  const hasPayment = Boolean(reference);

  function handleReject() {
    onReject(rejectReason);
    setRejectReason('');
    setShowRejectInput(false);
  }

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        status === PAYMENT_STATUS.APPROVED
          ? 'border-emerald-200 bg-emerald-50/40'
          : status === PAYMENT_STATUS.REJECTED || status === PAYMENT_STATUS.CANCELLED
          ? 'border-red-200 bg-red-50/30'
          : status === PAYMENT_STATUS.SUBMITTED
          ? 'border-amber-200 bg-amber-50/30'
          : 'border-gray-100 bg-gray-50'
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest ${roleColor}`}>
            {roleLabel}
          </span>
          <span className="font-semibold text-gray-900 text-sm">{playerName || '—'}</span>
        </div>
        <PaymentStatusPill status={status} />
      </div>

      {/* Payment details */}
      {hasPayment ? (
        <div className="space-y-3">
          {/* Reference + sender row */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Payment Ref</p>
              <p className="font-mono text-sm font-semibold text-gray-900 break-all">{reference}</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Sender name</p>
              <p className="text-sm font-semibold text-gray-900">{senderName || '—'}</p>
            </div>
          </div>

          {/* Phone */}
          {phone && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </div>
          )}

          {/* Screenshot link */}
          {screenshot && (
            <a
              href={`/uploads/${screenshot}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View screenshot
            </a>
          )}

          {/* Rejection reason display */}
          {rejectionReason && (status === PAYMENT_STATUS.REJECTED || status === PAYMENT_STATUS.CANCELLED) && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-widest text-red-500 mb-0.5">Rejection reason</p>
              <p className="text-xs text-red-700 font-medium">{rejectionReason}</p>
            </div>
          )}

          {/* Action buttons — only when not yet decided */}
          {!locked && (
            <div className="pt-1 space-y-2">
              {showRejectInput ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter a rejection reason (required)…"
                    className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                      className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={busy || !rejectReason.trim()}
                      onClick={handleReject}
                      className="flex-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy ? 'Rejecting…' : 'Confirm reject'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject payment
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onApprove}
                    className="flex-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? 'Approving…' : 'Approve payment'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* No payment yet */
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white/60 px-4 py-3 text-xs text-gray-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No payment submitted yet
        </div>
      )}
    </div>
  );
}

// ─── Progress tracker for a challenge ───────────────────────
function PaymentProgressBar({ creatorStatus, challengerStatus }) {
  const steps = [
    { key: 'creator', label: 'Creator pays', status: creatorStatus },
    { key: 'challenger', label: 'Challenger pays', status: challengerStatus },
    { key: 'review', label: 'Admin review', status: (() => {
      if (creatorStatus === PAYMENT_STATUS.APPROVED && challengerStatus === PAYMENT_STATUS.APPROVED) return 'done';
      if (creatorStatus === PAYMENT_STATUS.REJECTED || challengerStatus === PAYMENT_STATUS.REJECTED) return 'rejected';
      if (creatorStatus === PAYMENT_STATUS.SUBMITTED || challengerStatus === PAYMENT_STATUS.SUBMITTED) return 'active';
      return 'pending';
    })() },
    { key: 'tickets', label: 'Tickets issued', status: (() => {
      if (creatorStatus === PAYMENT_STATUS.APPROVED && challengerStatus === PAYMENT_STATUS.APPROVED) return 'active';
      return 'pending';
    })() },
  ];

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, i) => {
        const isDone = step.status === PAYMENT_STATUS.APPROVED || step.status === 'done' || step.status === 'active';
        const isRejected = step.status === PAYMENT_STATUS.REJECTED || step.status === 'rejected';
        const isSubmitted = step.status === PAYMENT_STATUS.SUBMITTED;

        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center min-w-0">
              <div
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  isRejected
                    ? 'border-red-400 bg-red-100 text-red-600'
                    : isDone
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isSubmitted
                    ? 'border-amber-400 bg-amber-100 text-amber-700'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {isRejected ? '✕' : isDone ? '✓' : isSubmitted ? '◎' : i + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                  isRejected ? 'text-red-500' : isDone ? 'text-emerald-600' : isSubmitted ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 transition-all ${
                  isRejected || step.status === PAYMENT_STATUS.REJECTED
                    ? 'bg-red-200'
                    : isDone
                    ? 'bg-emerald-300'
                    : 'bg-gray-150'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function ChallengeAdminReview() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);  // e.g. "abc123:creator" or "abc123"
  const [payoutForms, setPayoutForms] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // ── Fetch ──────────────────────────────────────────────────
  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/challenges/admin/review');
      setChallenges(data.challenges || []);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  function flash(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  // ── Payment side review ────────────────────────────────────
  async function handlePaymentSideReview(challengeId, side, approved, reason) {
    setActionId(`${challengeId}:${side}`);
    setError('');
    try {
      await api.patch(`/challenges/${challengeId}/admin/payment/${side}`, {
        approved,
        reason: reason || undefined,
      });
      flash(approved ? `${side} payment approved.` : `${side} payment rejected.`);
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setActionId(null);
    }
  }

  // ── Whole-challenge approve/reject ─────────────────────────
  async function handleApproveChallenge(challengeId) {
    setActionId(challengeId);
    setError('');
    try {
      await api.post(`/challenges/${challengeId}/admin/approve`);
      flash('Challenge approved — tickets issued!');
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectChallenge(challengeId) {
    const reason = window.prompt('Reason for rejecting this challenge (required):');
    if (reason === null || !reason.trim()) return;
    setActionId(challengeId);
    setError('');
    try {
      await api.post(`/challenges/${challengeId}/admin/reject`, { reason });
      flash('Challenge rejected.');
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setActionId(null);
    }
  }

  // ── Payout form helpers ────────────────────────────────────
  function updatePayoutForm(challengeId, field, value) {
    setPayoutForms((prev) => ({
      ...prev,
      [challengeId]: { ...prev[challengeId], [field]: value },
    }));
  }

  async function handleApprovePayout(challengeId) {
    const form = payoutForms[challengeId] || {};
    if (!form.transactionId || !form.screenshot) {
      setError('A transaction ID and proof screenshot are required.');
      return;
    }
    setActionId(challengeId);
    setError('');
    try {
      const formData = new FormData();
      formData.append('approved', 'true');
      formData.append('transactionId', form.transactionId);
      formData.append('screenshot', form.screenshot);
      await api.patch(`/challenges/${challengeId}/admin/payout`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPayoutForms((prev) => ({ ...prev, [challengeId]: {} }));
      flash('Payout marked as paid.');
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectPayout(challengeId) {
    const form = payoutForms[challengeId] || {};
    if (!form.reason?.trim()) {
      setError('A rejection reason is required.');
      return;
    }
    setActionId(challengeId);
    setError('');
    try {
      await api.patch(`/challenges/${challengeId}/admin/payout`, {
        approved: false,
        reason: form.reason,
      });
      setPayoutForms((prev) => ({ ...prev, [challengeId]: {} }));
      flash('Payout rejected.');
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Something went wrong.'));
    } finally {
      setActionId(null);
    }
  }

  // ── Queues ─────────────────────────────────────────────────
  const reviewQueue = challenges.filter(
    (c) =>
      c.status === STATUS.ADMIN_REVIEW ||
      (c.status === STATUS.PAYMENT_PENDING &&
        (c.paymentReferenceCreator || c.paymentReferenceChallenger))
  );

  const payoutQueue = challenges.filter(
    (c) => c.status === STATUS.PAYOUT_PENDING || c.status === STATUS.PAYOUT_REJECTED
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Challenge Review</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review each player's payment individually. Both must be approved before tickets are issued.
        </p>
      </div>

      {/* Toast messages */}
      {successMsg && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Payment review section ──────────────────────── */}
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest">
              Payment Review
            </h2>
            {reviewQueue.length > 0 && (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                {reviewQueue.length} pending
              </span>
            )}
          </div>

          {reviewQueue.length === 0 ? (
            <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400">
              No payment reviews pending right now.
            </div>
          ) : (
            <div className="mb-10 space-y-6">
              {reviewQueue.map((challenge) => {
                const creatorStatus = challenge.paymentStatusCreator || PAYMENT_STATUS.PENDING;
                const challengerStatus = challenge.paymentStatusChallenger || PAYMENT_STATUS.PENDING;
                const bothApproved =
                  creatorStatus === PAYMENT_STATUS.APPROVED &&
                  challengerStatus === PAYMENT_STATUS.APPROVED;
                const creatorLocked = [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.REJECTED, PAYMENT_STATUS.CANCELLED].includes(creatorStatus);
                const challengerLocked = [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.REJECTED, PAYMENT_STATUS.CANCELLED].includes(challengerStatus);

                return (
                  <div
                    key={challenge.challengeId}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    {/* Challenge metadata */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <ChallengeBadge challenge={challenge} />
                          <span className="font-mono text-xs text-gray-400">{challenge.challengeId}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600">
                          <span>
                            <span className="font-semibold text-gray-900">{challenge.amount} Birr</span>
                            <span className="text-gray-400"> entry</span>
                          </span>
                          <span>
                            <span className="font-semibold text-gray-900">{challenge.totalPot} Birr</span>
                            <span className="text-gray-400"> total pot</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>Updated</p>
                        <p className="font-medium text-gray-600">{formatDate(challenge.updatedAt)}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <PaymentProgressBar
                      creatorStatus={creatorStatus}
                      challengerStatus={challengerStatus}
                    />

                    {/* Per-player payment cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PlayerPaymentCard
                        t={t}
                        role="creator"
                        playerName={challenge.creatorName}
                        reference={challenge.paymentReferenceCreator}
                        senderName={challenge.senderNameCreator}
                        phone={challenge.phoneCreator}
                        screenshot={challenge.screenshotCreator}
                        status={creatorStatus}
                        rejectionReason={challenge.paymentRejectionReasonCreator}
                        busy={actionId === `${challenge.challengeId}:creator`}
                        locked={creatorLocked}
                        onApprove={() =>
                          handlePaymentSideReview(challenge.challengeId, 'creator', true)
                        }
                        onReject={(reason) =>
                          handlePaymentSideReview(challenge.challengeId, 'creator', false, reason)
                        }
                      />
                      <PlayerPaymentCard
                        t={t}
                        role="challenger"
                        playerName={challenge.challengerName}
                        reference={challenge.paymentReferenceChallenger}
                        senderName={challenge.senderNameChallenger}
                        phone={challenge.phoneChallenger}
                        screenshot={challenge.screenshotChallenger}
                        status={challengerStatus}
                        rejectionReason={challenge.paymentRejectionReasonChallenger}
                        busy={actionId === `${challenge.challengeId}:challenger`}
                        locked={challengerLocked}
                        onApprove={() =>
                          handlePaymentSideReview(challenge.challengeId, 'challenger', true)
                        }
                        onReject={(reason) =>
                          handlePaymentSideReview(challenge.challengeId, 'challenger', false, reason)
                        }
                      />
                    </div>

                    {/* Footer actions */}
                    <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-gray-400">
                        {bothApproved ? (
                          <span className="text-emerald-600 font-semibold">
                            ✓ Both payments approved — ready to issue tickets
                          </span>
                        ) : (
                          <span>Approve each player's payment individually above</span>
                        )}
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleRejectChallenge(challenge.challengeId)}
                          disabled={!!actionId}
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject challenge
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveChallenge(challenge.challengeId)}
                          disabled={!bothApproved || !!actionId}
                          title={
                            !bothApproved
                              ? 'Approve both payments above first'
                              : 'Issue lottery tickets to both players'
                          }
                          className="rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionId === challenge.challengeId
                            ? 'Issuing tickets…'
                            : 'Approve & issue tickets'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Payout section ─────────────────────────────── */}
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest">
              Payout Requests
            </h2>
            {payoutQueue.length > 0 && (
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                {payoutQueue.length} pending
              </span>
            )}
          </div>

          {payoutQueue.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400">
              No payout requests pending.
            </div>
          ) : (
            <div className="space-y-6">
              {payoutQueue.map((challenge) => {
                const form = payoutForms[challenge.challengeId] || {};
                const busy = actionId === challenge.challengeId;

                return (
                  <div
                    key={challenge.challengeId}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                          challenge.status === STATUS.PAYOUT_REJECTED
                            ? 'bg-red-100 text-red-700'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        {challenge.status === STATUS.PAYOUT_REJECTED ? 'Payout rejected — resubmitted' : 'Payout requested'}
                      </span>
                      <span className="font-mono text-xs text-gray-400">{challenge.challengeId}</span>
                    </div>

                    {/* Previous rejection */}
                    {challenge.status === STATUS.PAYOUT_REJECTED && challenge.payoutRejectionReason && (
                      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-widest text-red-500 mb-0.5">Previous rejection reason</p>
                        <p className="text-xs font-medium text-red-700">{challenge.payoutRejectionReason}</p>
                      </div>
                    )}

                    {/* Payout info */}
                    <div className="grid gap-3 sm:grid-cols-3 mb-4">
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Winning ticket</p>
                        <p className="font-mono text-sm font-bold text-gray-900">{challenge.winnerTicketNumber || '—'}</p>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Total pot</p>
                        <p className="text-sm font-bold text-gray-900">{challenge.totalPot} Birr</p>
                      </div>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-0.5">Net payout</p>
                        <p className="text-sm font-bold text-emerald-700">{challenge.payoutNetAmount ?? '—'} Birr</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-5">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Bank details</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {challenge.accountName}
                        <span className="mx-2 text-gray-300">·</span>
                        {challenge.accountNumber}
                        <span className="mx-2 text-gray-300">·</span>
                        {challenge.bankName}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Mark as paid */}
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Mark as paid</p>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Transaction ID</label>
                        <input
                          type="text"
                          value={form.transactionId || ''}
                          onChange={(e) => updatePayoutForm(challenge.challengeId, 'transactionId', e.target.value)}
                          placeholder="Bank transaction reference"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 mb-3"
                        />
                        <label className="block text-xs font-medium text-gray-600 mb-1">Transfer screenshot</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updatePayoutForm(challenge.challengeId, 'screenshot', e.target.files?.[0] || null)}
                          className="mb-3 text-xs text-gray-600"
                        />
                        <button
                          type="button"
                          disabled={busy || !form.transactionId || !form.screenshot}
                          onClick={() => handleApprovePayout(challenge.challengeId)}
                          className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? 'Processing…' : 'Confirm payout sent'}
                        </button>
                      </div>

                      {/* Reject payout */}
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Reject payout</p>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rejection reason</label>
                        <textarea
                          value={form.reason || ''}
                          onChange={(e) => updatePayoutForm(challenge.challengeId, 'reason', e.target.value)}
                          placeholder="Required — explain why the payout is rejected"
                          rows={4}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 mb-3"
                        />
                        <button
                          type="button"
                          disabled={busy || !form.reason?.trim()}
                          onClick={() => handleRejectPayout(challenge.challengeId)}
                          className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? 'Processing…' : 'Reject payout'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}