
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function statusLabel(status) {
  const labels = {
    WAITING: 'Waiting for opponent',
    ACCEPTED: 'Accepted',
    PAYMENT_PENDING: 'Waiting for payment',
    ADMIN_REVIEW: 'Pending admin review',
    APPROVED: 'Approved',
    DRAW_SCHEDULED: 'Draw scheduled',
    DRAW_COMPLETED: 'Draw completed',
    WINNER_REQUESTED_PAYOUT: 'Payout requested',
    PAYOUT_REVIEW: 'Payout review',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
}

function StatusBadge({ status }) {
  const colorMap = {
    WAITING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ACCEPTED: 'bg-blue-100 text-blue-800 border-blue-200',
    PAYMENT_PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
    ADMIN_REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    APPROVED: 'bg-sky-100 text-sky-800 border-sky-200',
    DRAW_SCHEDULED: 'bg-violet-100 text-violet-800 border-violet-200',
    DRAW_COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    WINNER_REQUESTED_PAYOUT: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    PAYOUT_REVIEW: 'bg-purple-100 text-purple-800 border-purple-200',
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {statusLabel(status)}
    </span>
  );
}

function DrawCountdown({ drawAt }) {
  const [remaining, setRemaining] = useState(() => new Date(drawAt).getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(new Date(drawAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [drawAt]);

  if (remaining <= 0) return <span>Draw is running now…</span>;
  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return <span>{minutes}:{String(seconds).padStart(2, '0')} remaining</span>;
}

export default function ChallengeDetail() {
  const { t } = useTranslation();
  const { challengeId } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // payment form state
  const [paymentReference, setPaymentReference] = useState('');
  const [senderName, setSenderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  // payout request form state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  function loadChallenge() {
    setLoading(true);
    setError('');
    return api
      .get(`/challenges/${challengeId}`)
      .then((res) => setChallenge(res.data.challenge))
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId]);

  // Poll while a draw is scheduled so the UI flips to DRAW_COMPLETED
  // automatically once the background worker runs it.
  useEffect(() => {
    if (challenge?.status !== 'DRAW_SCHEDULED') return undefined;
    const poll = setInterval(() => {
      api
        .get(`/challenges/${challengeId}`)
        .then((res) => setChallenge(res.data.challenge))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(poll);
  }, [challenge?.status, challengeId]);

  async function handleAccept() {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/challenges/${challengeId}/accept`);
      setChallenge(data.challenge);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('paymentReference', paymentReference);
      formData.append('senderName', senderName);
      formData.append('phoneNumber', phoneNumber);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const { data } = await api.post(`/challenges/${challengeId}/pay`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setChallenge(data.challenge);
      setPaymentReference('');
      setSenderName('');
      setPhoneNumber('');
      setScreenshot(null);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePayoutRequest(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post(`/challenges/${challengeId}/payout`, {
        bankName,
        accountNumber,
        accountName,
      });
      setChallenge(data.challenge);
      setBankName('');
      setAccountNumber('');
      setAccountName('');
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm animate-pulse" />
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-gray-600">{t('challenge.notFound', 'Challenge not found.')}</p>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === challenge.creatorId;
  const isChallenger = user?.id === challenge.challengerId;
  const isWinner = user?.id === challenge.winnerUserId;

  const canAccept = challenge.status === 'WAITING' && !isCreator;
  const canSubmitPayment = ['ACCEPTED', 'PAYMENT_PENDING'].includes(challenge.status) && (isCreator || isChallenger);
  const paymentFieldMissing = isCreator ? !challenge.paymentReferenceCreator : !challenge.paymentReferenceChallenger;
  const canRequestPayout = (challenge.status === 'DRAW_COMPLETED' || challenge.status === 'PAYOUT_REVIEW') && isWinner;

  const myTicket = isCreator ? challenge.ticketNumberCreator : isChallenger ? challenge.ticketNumberChallenger : null;

  const winnerLabel = () => {
    if (!challenge.winnerUserId) return '-';
    if (challenge.winnerUserId === user?.id) return t('challenge.you', 'You');
    if (challenge.winnerUserId === challenge.creatorId) return challenge.creatorName || t('challenge.creator', 'Creator');
    if (challenge.winnerUserId === challenge.challengerId) return challenge.challengerName || t('challenge.challenger', 'Challenger');
    return challenge.winnerUserId;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                {t('challenge.details', 'Challenge Details')}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">{challenge.challengeId}</h1>
            </div>
            <StatusBadge status={challenge.status} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.amount', 'Entry Amount')}</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">{challenge.amount} Birr</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.totalPot', 'Total Pot')}</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">{challenge.totalPot} Birr</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.creator', 'Creator')}</p>
              <p className="mt-2 font-medium text-gray-900">{challenge.creatorName || '-'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.challenger', 'Challenger')}</p>
              <p className="mt-2 font-medium text-gray-900">{challenge.challengerName || '-'}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {canAccept && (
          <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-indigo-900">{t('challenge.acceptTitle', 'Accept this Challenge')}</h2>
            <p className="mt-2 text-sm text-indigo-700">
              {t('challenge.acceptHint', 'Confirm acceptance to join this 1v1 stake and proceed to payment submission.')}
            </p>
            <button
              type="button"
              onClick={handleAccept}
              disabled={submitting}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t('common.saving', 'Saving...') : t('challenge.acceptButton', 'Accept Challenge')}
            </button>
          </div>
        )}

        {canSubmitPayment && paymentFieldMissing && (
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-orange-900">{t('challenge.paymentTitle', 'Submit Payment Details')}</h2>
            <p className="mt-2 text-sm text-orange-700">
              {t('challenge.paymentHint', 'Both players must submit their payment details before admin review can begin.')}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handlePaymentSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('challenge.senderName', 'Sender Name')}</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder={t('challenge.senderNamePlaceholder', 'Name on the sending account')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('challenge.phoneNumber', 'Phone Number')}</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder={t('challenge.phoneNumberPlaceholder', '09xxxxxxxx')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('challenge.paymentReference', 'Payment Reference')}</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(event) => setPaymentReference(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder={t('challenge.paymentReferencePlaceholder', 'Enter transaction or receipt reference')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('challenge.paymentScreenshot', 'Upload proof')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setScreenshot(event.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !paymentReference || !senderName || !phoneNumber}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t('common.saving', 'Saving...') : t('challenge.submitPayment', 'Submit Payment')}
              </button>
            </form>
          </div>
        )}

        {challenge.status === 'DRAW_SCHEDULED' && myTicket && (
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-violet-900">{t('challenge.yourTicket', 'Your Lottery Number')}</h2>
            <p className="mt-2 text-2xl font-bold text-violet-900">{myTicket}</p>
            <p className="mt-2 text-sm text-violet-700">
              {t('challenge.drawCountdown', 'Draw happens automatically —')} <DrawCountdown drawAt={challenge.drawAt} />
            </p>
          </div>
        )}

        {canRequestPayout && (
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-cyan-900">{t('challenge.payoutTitle', 'Congratulations — Request Payout')}</h2>
            <p className="mt-2 text-sm text-cyan-700">
              {t('challenge.payoutHint', 'You won this challenge. Enter your bank details to request your payout.')}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handlePayoutRequest}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('challenge.bankName', 'Bank Name')}</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(event) => setBankName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('challenge.accountNumber', 'Account Number')}</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(event) => setAccountNumber(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('challenge.accountName', 'Account Name')}</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || !bankName || !accountNumber || !accountName}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t('common.saving', 'Saving...') : t('challenge.requestPayout', 'Request Payout')}
              </button>
            </form>
          </div>
        )}

        {['waiting_payment', 'rejected'].includes(challenge.payoutStatus) && isWinner && (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm text-sm text-gray-600">
            {challenge.payoutStatus === 'waiting_payment'
              ? t('challenge.payoutPending', 'Your payout request is being reviewed by an admin.')
              : t('challenge.payoutRejected', 'Your payout request was rejected. You may update your details and request again.')}
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{t('challenge.activity', 'Challenge Activity')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.createdAt', 'Created')}</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{challenge.createdAt ? new Date(challenge.createdAt).toLocaleString() : '-'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.drawAt', 'Draw date')}</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{challenge.drawAt ? new Date(challenge.drawAt).toLocaleString() : '-'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{t('challenge.winner', 'Winner')}</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{winnerLabel()}</p>
              {challenge.winnerTicketNumber && (
                <p className="mt-2 text-xs text-gray-500">{t('challenge.winnerTicket', 'Ticket')} {challenge.winnerTicketNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
