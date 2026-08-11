
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// // Mirrors backend/src/modules/challenge/challenge.service.js STATUS / PAYMENT_STATUS
// const STATUS = {
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

// // One side (creator or challenger) of a challenge's payment, with its own
// // approve/reject controls.
// // Maps to: PATCH /api/challenges/:challengeId/admin/payment/:side
// //          body { approved, reason } -> approvePlayerPayment()
// function PaymentSideCard({ t, label, reference, senderName, phone, status, busy, onApprove, onReject }) {
//   const [reason, setReason] = useState('');
//   const locked = status === PAYMENT_STATUS.APPROVED;

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
//         <PaymentStatusPill status={status} />
//       </div>
//       <p className="mt-2 text-sm text-gray-900">{reference || t('challenge.notSubmitted', 'Not submitted')}</p>
//       {senderName && (
//         <p className="mt-1 text-xs text-gray-500">{senderName} · {phone}</p>
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

//   // Per-challenge payout processing form values, keyed by challengeId
//   const [payoutForms, setPayoutForms] = useState({});

//   async function fetchChallenges() {
//     setLoading(true);
//     setError('');
//     try {
//       // GET /api/challenges/admin/review -> listAdminReviewChallenges()
//       // Returns challenges with status AWAITING_ADMIN_APPROVAL, PAYOUT_PENDING,
//       // or PAYOUT_REJECTED.
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

//   // ---- Payment side approval (per player) -------------------------------
//   // PATCH /api/challenges/:challengeId/admin/payment/:side
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

//   // ---- Full challenge approval (both payment sides already approved) ----
//   // POST /api/challenges/:challengeId/admin/approve
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

//   // POST /api/challenges/:challengeId/admin/reject
//   async function handleRejectChallenge(challengeId) {
//     const reason = window.prompt(t('challenge.rejectChallengeReasonPrompt', 'Reason for rejecting this challenge:'));
//     if (reason === null) return; // cancelled
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

//   // ---- Payout processing --------------------------------------------------
//   // PATCH /api/challenges/:challengeId/admin/payout
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

//       // approved=true -> processPayout() sets status COMPLETED / payout_status PAYOUT_APPROVED
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

//   const reviewQueue = challenges.filter((c) => c.status === STATUS.AWAITING_ADMIN_APPROVAL);
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

//                 return (
//                   <div key={challenge.challengeId} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//                     <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//                       <div className="space-y-2">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
//                             {challenge.status}
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
//                         busy={actionId === `${challenge.challengeId}:challenger`}
//                         onApprove={() => handlePaymentSideReview(challenge.challengeId, 'challenger', true)}
//                         onReject={(reason) => handlePaymentSideReview(challenge.challengeId, 'challenger', false, reason)}
//                       />
//                     </div>

//                     <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
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

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

// Mirrors backend status definitions
const STATUS = {
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  AWAITING_ADMIN_APPROVAL: 'ADMIN_REVIEW',
  APPROVED: 'APPROVED',
  PAYOUT_PENDING: 'WINNER_REQUESTED_PAYOUT',
  PAYOUT_REJECTED: 'PAYOUT_REVIEW',
  COMPLETED: 'PAID',
};

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleString() : '—';
}

function PaymentStatusPill({ status }) {
  const colorMap = {
    [PAYMENT_STATUS.PENDING]: 'bg-gray-100 text-gray-700',
    [PAYMENT_STATUS.APPROVED]: 'bg-green-100 text-green-700',
    [PAYMENT_STATUS.REJECTED]: 'bg-red-100 text-red-700',
  };
  const labels = {
    [PAYMENT_STATUS.PENDING]: 'Pending',
    [PAYMENT_STATUS.APPROVED]: 'Approved',
    [PAYMENT_STATUS.REJECTED]: 'Rejected',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  );
}

function PaymentSideCard({ t, label, reference, senderName, phone, status, busy, onApprove, onReject }) {
  const [reason, setReason] = useState('');
  const locked = status === PAYMENT_STATUS.APPROVED;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <PaymentStatusPill status={status} />
      </div>
      <p className="mt-2 text-sm font-medium text-gray-900">{reference || t('challenge.notSubmitted', 'Not submitted')}</p>
      {senderName && (
        <p className="mt-1 text-xs text-gray-500">{senderName} · {phone}</p>
      )}

      {reference && !locked && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t('challenge.rejectionReasonPlaceholder', 'Rejection reason (optional)')}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onReject(reason)}
              className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('challenge.reject', 'Reject')}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onApprove()}
              className="flex-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('challenge.approve', 'Approve')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengeAdminReview() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const [payoutForms, setPayoutForms] = useState({});

  async function fetchChallenges() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/challenges/admin/review');
      setChallenges(data.challenges || []);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function handlePaymentSideReview(challengeId, side, approved, reason) {
    setActionId(`${challengeId}:${side}`);
    setError('');
    try {
      await api.patch(`/challenges/${challengeId}/admin/payment/${side}`, {
        approved,
        reason: reason || undefined,
      });
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setActionId(null);
    }
  }

  async function handleApproveChallenge(challengeId) {
    setActionId(challengeId);
    setError('');
    try {
      await api.post(`/challenges/${challengeId}/admin/approve`);
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectChallenge(challengeId) {
    const reason = window.prompt(t('challenge.rejectChallengeReasonPrompt', 'Reason for rejecting this challenge:'));
    if (reason === null) return;
    setActionId(challengeId);
    setError('');
    try {
      await api.post(`/challenges/${challengeId}/admin/reject`, { reason });
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setActionId(null);
    }
  }

  function updatePayoutForm(challengeId, field, value) {
    setPayoutForms((prev) => ({
      ...prev,
      [challengeId]: { ...prev[challengeId], [field]: value },
    }));
  }

  async function handleApprovePayout(challengeId) {
    const form = payoutForms[challengeId] || {};
    if (!form.transactionId || !form.screenshot) {
      setError(t('challenge.payoutApprovalFieldsRequired', 'A transaction ID and proof screenshot are required to mark this payout as paid.'));
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
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectPayout(challengeId) {
    const form = payoutForms[challengeId] || {};
    if (!form.reason) {
      setError(t('challenge.payoutRejectionReasonRequired', 'A rejection reason is required.'));
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
      await fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setActionId(null);
    }
  }

  // FIX: Include challenges that are ADMIN_REVIEW OR PAYMENT_PENDING (where at least 1 side has paid)
  const reviewQueue = challenges.filter(
    (c) =>
      c.status === STATUS.AWAITING_ADMIN_APPROVAL ||
      (c.status === STATUS.PAYMENT_PENDING && (c.paymentReferenceCreator || c.paymentReferenceChallenger))
  );

  const payoutQueue = challenges.filter(
    (c) => c.status === STATUS.PAYOUT_PENDING || c.status === STATUS.PAYOUT_REJECTED
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{t('challenge.adminReviewTitle', 'Challenge Review')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('challenge.adminReviewSubtitle', 'Approve or reject pending challenge payment submissions from players.')}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-28 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('challenge.paymentReviewQueue', 'Payment Review')}</h2>
          {reviewQueue.length === 0 ? (
            <div className="mb-10 rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
              {t('challenge.adminReviewEmpty', 'No challenge reviews are currently pending.')}
            </div>
          ) : (
            <div className="mb-10 space-y-6">
              {reviewQueue.map((challenge) => {
                const bothApproved =
                  challenge.paymentStatusCreator === PAYMENT_STATUS.APPROVED &&
                  challenge.paymentStatusChallenger === PAYMENT_STATUS.APPROVED;

                const hasOnePayment =
                  Boolean(challenge.paymentReferenceCreator) !== Boolean(challenge.paymentReferenceChallenger);

                return (
                  <div key={challenge.challengeId} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            hasOnePayment ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {hasOnePayment ? 'PARTIAL PAYMENT (1/2)' : challenge.status}
                          </span>
                          <span className="text-sm text-gray-500">{challenge.challengeId}</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.amount', 'Entry')}</p>
                            <p className="mt-1 font-semibold text-gray-900">{challenge.amount} Birr</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.totalPot', 'Total Pot')}</p>
                            <p className="mt-1 font-semibold text-gray-900">{challenge.totalPot} Birr</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.creator', 'Creator')}</p>
                            <p className="mt-1 text-gray-900">{challenge.creatorName || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.challenger', 'Challenger')}</p>
                            <p className="mt-1 text-gray-900">{challenge.challengerName || '-'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.updatedAt', 'Updated')}</p>
                        <p className="font-medium text-gray-700">{formatDate(challenge.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <PaymentSideCard
                        t={t}
                        label={t('challenge.creatorPayment', 'Creator payment')}
                        reference={challenge.paymentReferenceCreator}
                        senderName={challenge.senderNameCreator}
                        phone={challenge.phoneCreator}
                        status={challenge.paymentStatusCreator}
                        busy={actionId === `${challenge.challengeId}:creator`}
                        onApprove={() => handlePaymentSideReview(challenge.challengeId, 'creator', true)}
                        onReject={(reason) => handlePaymentSideReview(challenge.challengeId, 'creator', false, reason)}
                      />
                      <PaymentSideCard
                        t={t}
                        label={t('challenge.challengerPayment', 'Challenger payment')}
                        reference={challenge.paymentReferenceChallenger}
                        senderName={challenge.senderNameChallenger}
                        phone={challenge.phoneChallenger}
                        status={challenge.paymentStatusChallenger}
                        busy={actionId === `${challenge.challengeId}:challenger`}
                        onApprove={() => handlePaymentSideReview(challenge.challengeId, 'challenger', true)}
                        onReject={(reason) => handlePaymentSideReview(challenge.challengeId, 'challenger', false, reason)}
                      />
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleRejectChallenge(challenge.challengeId)}
                        disabled={actionId === challenge.challengeId}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {t('challenge.rejectChallenge', 'Reject Challenge')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveChallenge(challenge.challengeId)}
                        disabled={!bothApproved || actionId === challenge.challengeId}
                        title={!bothApproved ? t('challenge.bothSidesRequired', 'Both payment sides must be approved first') : undefined}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionId === challenge.challengeId
                          ? t('common.processing', 'Processing...')
                          : t('challenge.approveChallenge', 'Approve Challenge & Issue Tickets')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('challenge.payoutQueue', 'Payout Requests')}</h2>
          {payoutQueue.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600">
              {t('challenge.payoutQueueEmpty', 'No payout requests are currently pending.')}
            </div>
          ) : (
            <div className="space-y-6">
              {payoutQueue.map((challenge) => {
                const form = payoutForms[challenge.challengeId] || {};
                const busy = actionId === challenge.challengeId;
                const alreadyPaid = challenge.status === STATUS.COMPLETED;

                return (
                  <div key={challenge.challengeId} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          challenge.status === STATUS.PAYOUT_REJECTED
                            ? 'bg-red-100 text-red-700'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        {challenge.status}
                      </span>
                      <span className="text-sm text-gray-500">{challenge.challengeId}</span>
                    </div>

                    {challenge.status === STATUS.PAYOUT_REJECTED && challenge.payoutRejectionReason && (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {t('challenge.previousRejectionReason', 'Previously rejected')}: {challenge.payoutRejectionReason}
                      </p>
                    )}

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.winnerTicket', 'Winning Ticket')}</p>
                        <p className="mt-1 font-semibold text-gray-900">{challenge.winnerTicketNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.totalPot', 'Total Pot')}</p>
                        <p className="mt-1 font-semibold text-gray-900">{challenge.totalPot} Birr</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{t('challenge.payoutNet', 'Net Payout')}</p>
                        <p className="mt-1 font-semibold text-gray-900">{challenge.payoutNetAmount ?? '—'} Birr</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      {t('challenge.payoutBank', 'Bank')}: {challenge.bankName} · {challenge.accountNumber} · {challenge.accountName}
                    </p>

                    {alreadyPaid ? (
                      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-semibold text-emerald-800">
                          {t('challenge.userPaidStatus', 'Winner has been paid')}
                        </p>
                        {challenge.payoutTransactionId && (
                          <p className="mt-1 text-xs text-emerald-700">
                            {t('challenge.transactionId', 'Transaction ID')}: {challenge.payoutTransactionId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('challenge.markAsPaid', 'Mark as Paid')}</p>
                          <label className="mt-3 block text-xs font-medium text-gray-600">{t('challenge.transactionId', 'Transaction ID')}</label>
                          <input
                            type="text"
                            value={form.transactionId || ''}
                            onChange={(event) => updatePayoutForm(challenge.challengeId, 'transactionId', event.target.value)}
                            placeholder={t('challenge.transactionIdPlaceholder', 'Bank transaction ID')}
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                          <label className="mt-3 block text-xs font-medium text-gray-600">{t('challenge.proofScreenshot', 'Proof of transfer (screenshot)')}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => updatePayoutForm(challenge.challengeId, 'screenshot', event.target.files?.[0] || null)}
                            className="mt-1 text-xs"
                          />
                          <button
                            type="button"
                            disabled={busy || !form.transactionId || !form.screenshot}
                            onClick={() => handleApprovePayout(challenge.challengeId)}
                            className="mt-4 w-full rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {busy ? t('common.processing', 'Processing...') : t('challenge.confirmPayoutSent', 'Confirm Payout Sent')}
                          </button>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{t('challenge.rejectPayout', 'Reject Payout')}</p>
                          <textarea
                            value={form.reason || ''}
                            onChange={(event) => updatePayoutForm(challenge.challengeId, 'reason', event.target.value)}
                            placeholder={t('challenge.rejectionReasonPlaceholder', 'Reason (required)')}
                            rows={3}
                            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                          />
                          <button
                            type="button"
                            disabled={busy || !form.reason}
                            onClick={() => handleRejectPayout(challenge.challengeId)}
                            className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {busy ? t('common.processing', 'Processing...') : t('challenge.rejectPayoutButton', 'Reject Payout')}
                          </button>
                        </div>
                      </div>
                    )}
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