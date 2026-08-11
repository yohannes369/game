import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { STATUS_FLOW, DELETE_ROLES } from './lotteryConstants';

export default function ManagePanel({ lottery, user, onChanged, onDeleted }) {
  const { t }    = useTranslation();
  const [name,        setName]        = useState('');
  const [price,       setPrice]       = useState('');
  const [ticketCount, setTicketCount] = useState('');
  const [error,       setError]       = useState('');
  const [busy,        setBusy]        = useState(false);

  const canDelete = user && DELETE_ROLES.includes(user.role);

  async function addPackage(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await api.post(`/lotteries/${lottery.id}/packages`, {
        name, price: Number(price), ticketCount: Number(ticketCount),
      });
      setName(''); setPrice(''); setTicketCount('');
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally { setBusy(false); }
  }

  async function changeStatus(status) {
    setError(''); setBusy(true);
    try {
      await api.patch(`/lotteries/${lottery.id}/status`, { status });
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally { setBusy(false); }
  }

  async function triggerDraw() {
    if (!window.confirm(t('lottery.confirmDraw'))) return;
    setError(''); setBusy(true);
    try {
      await api.post(`/winners/lottery/${lottery.id}/draw`);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally { setBusy(false); }
  }

  async function deleteLottery() {
    if (!window.confirm(t('lottery.confirmDelete', { defaultValue: 'Delete this lottery? This cannot be undone.' }))) return;
    setError(''); setBusy(true);
    try {
      await api.delete(`/lotteries/${lottery.id}`);
      onDeleted?.();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{t('lottery.manage')}</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Status buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FLOW.map((s) => (
          <button
            key={s} type="button"
            disabled={busy || s === lottery.status}
            onClick={() => changeStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
              s === lottery.status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {t(`status.${s}`)}
          </button>
        ))}

        <button
          type="button" disabled={busy} onClick={triggerDraw}
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-400 disabled:opacity-50"
        >
          {t('lottery.drawNow')}
        </button>

        {canDelete && (
          <button
            type="button" disabled={busy} onClick={deleteLottery}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            {t('lottery.deleteLottery', { defaultValue: 'Delete Lottery' })}
          </button>
        )}
      </div>

      {/* Add-package form (package-mode only) */}
      {lottery.ticketMode === 'package' && (
        <form onSubmit={addPackage} className="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('lottery.form.addPackage')}
          </span>
          {[
            { label: t('lottery.form.packageName'),    value: name,        setter: setName,        type: 'text'   },
            { label: t('lottery.form.packagePrice'),   value: price,       setter: setPrice,       type: 'number' },
            { label: t('lottery.form.packageTickets'), value: ticketCount, setter: setTicketCount, type: 'number' },
          ].map(({ label, value, setter, type }) => (
            <label key={label} className="block space-y-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <input
                type={type} value={value} required
                onChange={(e) => setter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </label>
          ))}
          <div className="flex justify-end">
            <button
              type="submit" disabled={busy}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {t('lottery.form.save')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}