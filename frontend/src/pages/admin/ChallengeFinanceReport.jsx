// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// export default function ChallengeFinanceReport() {
//   const { t } = useTranslation();
//   const [report, setReport] = useState(null);
//   const [ratePercent, setRatePercent] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [savingRate, setSavingRate] = useState(false);
//   const [savedMessage, setSavedMessage] = useState('');

//   async function loadAll() {
//     setLoading(true);
//     setError('');
//     try {
//       const [reportRes, rateRes] = await Promise.all([
//         api.get('/challenges/admin/finance-report'),
//         api.get('/challenges/admin/commission'),
//       ]);
//       setReport(reportRes.data);
//       setRatePercent(String(rateRes.data.ratePercent));
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function handleRateSave(event) {
//     event.preventDefault();
//     setSavingRate(true);
//     setError('');
//     setSavedMessage('');
//     try {
//       await api.put('/challenges/admin/commission', { ratePercent: Number(ratePercent) });
//       setSavedMessage(t('challenge.commissionSaved', 'Commission rate updated. Applies to future draws only.'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSavingRate(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-semibold text-gray-900">{t('challenge.financeReportTitle', 'Challenge Finance Report')}</h1>
//         <p className="mt-2 text-sm text-gray-600">
//           {t('challenge.financeReportSubtitle', 'Every paid-out challenge, the commission taken, and the net amount sent to the winner.')}
//         </p>
//       </div>

//       <div className="mb-8 rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-indigo-900">{t('challenge.commissionTitle', 'Commission Rate')}</h2>
//         <p className="mt-2 text-sm text-indigo-700">
//           {t('challenge.commissionHint', 'Percentage taken from the total pot before a winner is paid out. Changing this only affects challenges drawn after the change.')}
//         </p>
//         <form className="mt-4 flex flex-wrap items-end gap-4" onSubmit={handleRateSave}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">{t('challenge.ratePercent', 'Rate (%)')}</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               step="0.5"
//               value={ratePercent}
//               onChange={(event) => setRatePercent(event.target.value)}
//               className="mt-2 w-32 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={savingRate || ratePercent === ''}
//             className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {savingRate ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
//           </button>
//         </form>
//         {savedMessage && <p className="mt-3 text-sm text-indigo-700">{savedMessage}</p>}
//       </div>

//       {error && (
//         <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
//       )}

//       {loading ? (
//         <div className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
//       ) : (
//         <>
//           <div className="mb-6 grid gap-4 sm:grid-cols-3">
//             <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">{t('challenge.totalPot', 'Total Pot Across All Paid')}</p>
//               <p className="mt-2 text-2xl font-semibold text-gray-900">{report?.totals.totalPot ?? 0} Birr</p>
//             </div>
//             <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">{t('challenge.totalCommission', 'Total Commission Earned')}</p>
//               <p className="mt-2 text-2xl font-semibold text-emerald-700">{report?.totals.totalCommission ?? 0} Birr</p>
//             </div>
//             <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">{t('challenge.totalPaidOut', 'Total Paid Out to Winners')}</p>
//               <p className="mt-2 text-2xl font-semibold text-gray-900">{report?.totals.totalPaidOut ?? 0} Birr</p>
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.id', 'Challenge')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.winner', 'Winner')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.totalPot', 'Total Pot')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.rate', 'Rate')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.commission', 'Commission')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.payoutNet', 'Net Payout')}</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.paidAt', 'Paid At')}</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {(report?.challenges || []).map((row) => (
//                   <tr key={row.challengeId}>
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.challengeId}</td>
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.winnerName || '-'}</td>
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.totalPot} Birr</td>
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.commissionRatePercent ?? '-'}%</td>
//                     <td className="px-4 py-3 text-sm text-emerald-700">{row.commissionAmount} Birr</td>
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.payoutNetAmount} Birr</td>
//                     <td className="px-4 py-3 text-sm text-gray-500">{new Date(row.paidAt).toLocaleString()}</td>
//                   </tr>
//                 ))}
//                 {(!report || report.challenges.length === 0) && (
//                   <tr>
//                     <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
//                       {t('challenge.financeReportEmpty', 'No paid challenges yet.')}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleString() : '—';
}

export default function ChallengeFinanceReport() {
  const { t } = useTranslation();
  const [report, setReport] = useState(null);
  const [ratePercent, setRatePercent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingRate, setSavingRate] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [reportRes, rateRes] = await Promise.all([
        api.get('/challenges/admin/finance-report'),
        api.get('/challenges/admin/commission'),
      ]);
      setReport(reportRes.data);
      setRatePercent(String(rateRes.data.ratePercent));
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRateSave(event) {
    event.preventDefault();
    setSavingRate(true);
    setError('');
    setSavedMessage('');
    try {
      await api.put('/challenges/admin/commission', { ratePercent: Number(ratePercent) });
      setSavedMessage(t('challenge.commissionSaved', 'Commission rate updated. Applies to future draws only.'));
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSavingRate(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">{t('challenge.financeReportTitle', 'Challenge Finance Report')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('challenge.financeReportSubtitle', 'Every paid-out challenge, the commission taken, and the net amount sent to the winner.')}
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-indigo-900">{t('challenge.commissionTitle', 'Commission Rate')}</h2>
        <p className="mt-2 text-sm text-indigo-700">
          {t('challenge.commissionHint', 'Percentage taken from the total pot before a winner is paid out. Changing this only affects challenges drawn after the change.')}
        </p>
        <form className="mt-4 flex flex-wrap items-end gap-4" onSubmit={handleRateSave}>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('challenge.ratePercent', 'Rate (%)')}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={ratePercent}
              onChange={(event) => setRatePercent(event.target.value)}
              className="mt-2 w-32 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={savingRate || ratePercent === ''}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingRate ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
          </button>
        </form>
        {savedMessage && <p className="mt-3 text-sm text-indigo-700">{savedMessage}</p>}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">{t('challenge.totalPot', 'Total Pot Across All Paid')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{report?.totals.totalPot ?? 0} Birr</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">{t('challenge.totalCommission', 'Total Commission Earned')}</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{report?.totals.totalCommission ?? 0} Birr</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">{t('challenge.totalPaidOut', 'Total Paid Out to Winners')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{report?.totals.totalPaidOut ?? 0} Birr</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.id', 'Challenge')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.winner', 'Winner')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.totalPot', 'Total Pot')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.rate', 'Rate')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.commission', 'Commission')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.payoutNet', 'Net Payout')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{t('challenge.paidAt', 'Paid At')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(report?.challenges || []).map((row) => (
                  <tr key={row.challengeId}>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.challengeId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.winnerName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.totalPot} Birr</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.commissionRatePercent ?? '-'}%</td>
                    <td className="px-4 py-3 text-sm text-emerald-700">{row.commissionAmount} Birr</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.payoutNetAmount} Birr</td>
                    {/*
                      challenge.service.js -> getFinanceReport() returns each
                      row's date as `completedAt`, not `paidAt`. Using the
                      wrong key here silently rendered "Invalid Date".
                    */}
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(row.completedAt)}</td>
                  </tr>
                ))}
                {(!report || report.challenges.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      {t('challenge.financeReportEmpty', 'No paid challenges yet.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}