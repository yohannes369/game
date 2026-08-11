import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { PAYMENT_METHODS, AUTO_LOCK_MINUTES } from './lotteryConstants';

export default function PaymentForm({ lottery, onSubmitted, closingSoon }) {
  const { t } = useTranslation();
  const isPackageMode = lottery.ticketMode === 'package';

  const [packageId,     setPackageId]     = useState('');
  const [amount,        setAmount]        = useState('');
  const [method,        setMethod]        = useState(PAYMENT_METHODS[0]);
  const [senderName,    setSenderName]    = useState('');
  const [phoneNumber,   setPhoneNumber]   = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot,    setScreenshot]    = useState(null);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [saving,        setSaving]        = useState(false);

  const selectedPkg   = lottery.packages?.find((p) => String(p.id) === String(packageId));
  const previewAmount = isPackageMode ? selectedPkg?.price : amount;
  const previewTickets =
    !isPackageMode && lottery.ticketMode === 'custom' && amount && lottery.ticketPrice
      ? Math.floor(Number(amount) / Number(lottery.ticketPrice))
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('lotteryId',     lottery.id);
      fd.append('amount',        isPackageMode ? previewAmount : amount);
      fd.append('method',        method);
      fd.append('senderName',    senderName);
      fd.append('phoneNumber',   phoneNumber);
      fd.append('transactionId', transactionId);
      if (isPackageMode) fd.append('packageId', packageId);
      if (screenshot)    fd.append('screenshot', screenshot);

      await api.post('/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      setSuccess(t('payments.submitSuccess'));
      setPackageId(''); setAmount(''); setSenderName('');
      setPhoneNumber(''); setTransactionId(''); setScreenshot(null);
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {t('payments.buyTickets')}
      </h3>

      {closingSoon && (
        <Alert variant="red">
          {t('payments.closingSoon', {
            defaultValue: `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
            minutes: AUTO_LOCK_MINUTES,
          })}
        </Alert>
      )}
      {error   && <Alert variant="red">{error}</Alert>}
      {success && <Alert variant="green">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Package picker or amount input */}
        {isPackageMode ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(lottery.packages || []).map((p) => {
              const isSelected = String(packageId) === String(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => setPackageId(p.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                  <div className="my-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{p.price}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {p.ticketCount} {t('lottery.tickets')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Field label={t('payments.amount')}>
            <input
              type="number" min="0" step="0.01" value={amount} required
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
            {previewTickets !== null && (
              <small className="block text-xs text-gray-500 dark:text-gray-400">
                {t('payments.ticketsPreview', { count: previewTickets })}
              </small>
            )}
          </Field>
        )}

        <Field label={t('payments.method')}>
          <select value={method} onChange={(e) => setMethod(e.target.value)} required className={inputCls}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{t(`payments.methods.${m}`)}</option>
            ))}
          </select>
        </Field>

        <Field label={t('payments.senderName')}>
          <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} required className={inputCls} />
        </Field>

        <Field label={t('payments.phoneNumber')}>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className={inputCls} />
        </Field>

        <Field label={t('payments.transactionId')}>
          <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required className={inputCls} />
        </Field>

        <Field label={t('payments.screenshot')}>
          <input
            type="file" accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-950 dark:file:text-indigo-300"
          />
        </Field>

        {previewAmount && (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('payments.total')}: {previewAmount}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving || closingSoon || (isPackageMode && !packageId)}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? t('common.saving') : t('payments.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── tiny local helpers ──────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400';

function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}

function Alert({ variant, children }) {
  const styles = {
    red:   'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300',
    green: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  };
  return (
    <div className={`mb-4 rounded-lg p-4 text-sm font-medium ${styles[variant]}`}>
      {children}
    </div>
  );
}