
// import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';

// const FINANCE_STAFF = ['admin', 'finance_admin'];

// function MyWins() {
//   const { t } = useTranslation();
//   const [wins, setWins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [reqWin, setReqWin] = useState(null);
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [accountName, setAccountName] = useState('');
//   const [saving, setSaving] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get('/winners/mine');
//       setWins(data.wins || data.winners || []);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   function openRequest(win) {
//     setError('');
//     setBankName('');
//     setAccountNumber('');
//     setAccountName('');
//     setReqWin(win);
//   }

//   async function submitRequest(e) {
//     e.preventDefault();
//     setError('');
//     setSaving(true);
//     try {
//       await api.post('/withdrawals', {
//         winnerId: reqWin.id,
//         bankName,
//         accountNumber,
//         accountName,
//       });
//       setReqWin(null);
//       await load();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   // Helper function to check if request button should be enabled
//   const canRequestWithdrawal = (w) => {
//     return !w.withdrawalStatus || w.withdrawalStatus === 'unrequested' || w.withdrawalStatus === 'rejected';
//   };

//   if (loading) return <p className="text-gray-500">{t('common.loading')}</p>;

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//       {wins.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">{t('withdrawals.noWins')}</div>
//       ) : (
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('lottery.title')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('lottery.prizeName')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('withdrawals.status')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('users.table.actions')}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {wins.map((w) => (
//               <tr key={w.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.lotteryTitle}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.prizeName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <StatusPill status={w.withdrawalStatus || 'unrequested'} />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     type="button"
//                     className={`font-medium py-1.5 px-3 rounded text-sm transition-colors ${
//                       canRequestWithdrawal(w)
//                         ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     }`}
//                     onClick={() => canRequestWithdrawal(w) && openRequest(w)}
//                     disabled={!canRequestWithdrawal(w)}
//                     title={!canRequestWithdrawal(w) ? t('withdrawals.alreadyRequested') : ''}
//                   >
//                     {w.withdrawalStatus === 'rejected' 
//                       ? t('withdrawals.resubmit') 
//                       : t('withdrawals.request')}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {reqWin && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           onClick={() => setReqWin(null)}
//         >
//           <div 
//             className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('withdrawals.requestForm')}</h3>
//             <form onSubmit={submitRequest} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('payments.bankName')}
//                 </label>
//                 <input 
//                   value={bankName} 
//                   onChange={(e) => setBankName(e.target.value)} 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('payments.accountNumber')}
//                 </label>
//                 <input 
//                   value={accountNumber} 
//                   onChange={(e) => setAccountNumber(e.target.value)} 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('payments.accountName')}
//                 </label>
//                 <input 
//                   value={accountName} 
//                   onChange={(e) => setAccountName(e.target.value)} 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button 
//                   type="button" 
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
//                   onClick={() => setReqWin(null)}
//                 >
//                   {t('users.form.cancel')}
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={saving}
//                 >
//                   {saving ? t('common.saving') : t('withdrawals.request')}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function PayoutQueue() {
//   const { t } = useTranslation();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [payId, setPayId] = useState(null);
//   const [transactionId, setTransactionId] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [rejectId, setRejectId] = useState(null);
//   const [rejectReason, setRejectReason] = useState('');
//   const [saving, setSaving] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get('/withdrawals/pending');
//       setItems(data.withdrawals || []);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function markPaid(e) {
//     e.preventDefault();
//     setError('');
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append('transactionId', transactionId);
//       if (screenshot) fd.append('screenshot', screenshot);
//       await api.patch(`/withdrawals/${payId}/pay`, fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setPayId(null);
//       setTransactionId('');
//       setScreenshot(null);
//       await load();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function submitReject(e) {
//     e.preventDefault();
//     setError('');
//     setSaving(true);
//     try {
//       await api.patch(`/withdrawals/${rejectId}/reject`, { reason: rejectReason });
//       setRejectId(null);
//       setRejectReason('');
//       await load();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <p className="text-gray-500">{t('common.loading')}</p>;

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//       {items.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">{t('withdrawals.empty')}</div>
//       ) : (
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('payments.table.user')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('payments.table.lottery')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('lottery.prizeName')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('payments.bankName')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('payments.accountNumber')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {t('users.table.actions')}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {items.map((w) => (
//               <tr key={w.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.username || w.winnerUserId}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.lotteryTitle}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.prizeName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.bankName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.accountNumber}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button 
//                     type="button" 
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors"
//                     onClick={() => setPayId(w.id)}
//                   >
//                     {t('withdrawals.markPaid')}
//                   </button>
//                   <button 
//                     type="button" 
//                     className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors"
//                     onClick={() => setRejectId(w.id)}
//                   >
//                     {t('withdrawals.reject')}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {payId && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           onClick={() => setPayId(null)}
//         >
//           <div 
//             className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('withdrawals.markPaid')}</h3>
//             <form onSubmit={markPaid} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('payments.transactionId')}
//                 </label>
//                 <input 
//                   value={transactionId} 
//                   onChange={(e) => setTransactionId(e.target.value)} 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('payments.screenshot')}
//                 </label>
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   onChange={(e) => setScreenshot(e.target.files?.[0] || null)} 
//                   required 
//                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button 
//                   type="button" 
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
//                   onClick={() => setPayId(null)}
//                 >
//                   {t('users.form.cancel')}
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={saving}
//                 >
//                   {saving ? t('common.saving') : t('withdrawals.markPaid')}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {rejectId && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           onClick={() => setRejectId(null)}
//         >
//           <div 
//             className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('withdrawals.reject')}</h3>
//             <form onSubmit={submitReject} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('withdrawals.rejectReason')}
//                 </label>
//                 <textarea
//                   value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                   required
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 />
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button 
//                   type="button" 
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
//                   onClick={() => setRejectId(null)}
//                 >
//                   {t('users.form.cancel')}
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={saving}
//                 >
//                   {saving ? t('common.saving') : t('withdrawals.reject')}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Withdrawals() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const isFinance = !!user && FINANCE_STAFF.includes(user.role);
//   const [tab, setTab] = useState('mine');

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">{t('withdrawals.title')}</h2>
//       </div>

//       {isFinance && (
//         <div className="flex gap-1 border-b border-gray-200 mb-6">
//           <button 
//             className={`px-4 py-2 text-sm font-medium transition-colors ${
//               tab === 'mine' 
//                 ? 'text-blue-600 border-b-2 border-blue-600' 
//                 : 'text-gray-500 hover:text-gray-700'
//             }`} 
//             onClick={() => setTab('mine')} 
//             type="button"
//           >
//             {t('withdrawals.myTab')}
//           </button>
//           <button 
//             className={`px-4 py-2 text-sm font-medium transition-colors ${
//               tab === 'queue' 
//                 ? 'text-blue-600 border-b-2 border-blue-600' 
//                 : 'text-gray-500 hover:text-gray-700'
//             }`} 
//             onClick={() => setTab('queue')} 
//             type="button"
//           >
//             {t('withdrawals.queueTab')}
//           </button>
//         </div>
//       )}

//       {tab === 'mine' ? <MyWins /> : <PayoutQueue />}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatusPill from '../../components/StatusPill';

const FINANCE_STAFF = ['admin', 'finance_admin'];

// Common payout options in Ethiopia. Add/remove as needed.
const BANK_OPTIONS = [
  { value: 'CBE', label: 'Commercial Bank of Ethiopia (CBE)' },
  { value: 'Telebirr', label: 'Telebirr' },
  { value: 'Awash Bank', label: 'Awash Bank' },
  { value: 'Dashen Bank', label: 'Dashen Bank' },
  { value: 'Bank of Abyssinia', label: 'Bank of Abyssinia' },
  { value: 'Wegagen Bank', label: 'Wegagen Bank' },
  { value: 'Cooperative Bank of Oromia', label: 'Cooperative Bank of Oromia' },
  { value: 'other', label: 'Other bank...' },
];

function MyWins() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reqWin, setReqWin] = useState(null);

  const [bankChoice, setBankChoice] = useState('');   // dropdown value (e.g. 'CBE', 'Telebirr', 'other')
  const [customBank, setCustomBank] = useState('');    // free text, only used when bankChoice === 'other'
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const [saving, setSaving] = useState(false);

  // The actual bank name that will be submitted
  const resolvedBankName =
    bankChoice === 'other' ? customBank.trim() : bankChoice;

  // ----------------------------------------------------
  // Load winner's withdrawals
  // ----------------------------------------------------
  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/winners/mine');

      setWins(data.wins || data.winners || []);
    } catch (err) {
      setError(
        err.response?.data?.message || t('errors.generic')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  // ----------------------------------------------------
  // Get full name from logged-in user
  // ----------------------------------------------------
  useEffect(() => {
    if (!user) {
      setAccountName('');
      return;
    }

    const fullName =
      user.fullName ||
      user.full_name ||
      user.name ||
      [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

    setAccountName(fullName || '');
  }, [user]);

  // ----------------------------------------------------
  // Open withdrawal request form
  // ----------------------------------------------------
  function openRequest(win) {
    setError('');
    setBankChoice('');
    setCustomBank('');
    setAccountNumber('');

    // Always use registered full name
    const fullName =
      user?.fullName ||
      user?.full_name ||
      user?.name ||
      [user?.firstName, user?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

    setAccountName(fullName || '');

    setReqWin(win);
  }

  // ----------------------------------------------------
  // Submit withdrawal request
  // ----------------------------------------------------
  async function submitRequest(e) {
    e.preventDefault();

    setError('');

    if (!accountName.trim()) {
      setError('Your registered full name could not be found.');
      return;
    }

    if (!bankChoice) {
      setError('Please select a bank or payment option.');
      return;
    }

    if (bankChoice === 'other' && !customBank.trim()) {
      setError('Please enter the bank name.');
      return;
    }

    if (!accountNumber.trim()) {
      setError(
        bankChoice === 'Telebirr'
          ? 'Please enter your Telebirr phone number.'
          : 'Please enter your account number.'
      );
      return;
    }

    if (!reqWin?.id) {
      setError('Invalid winner information.');
      return;
    }

    setSaving(true);

    try {
      await api.post('/withdrawals', {
        winnerId: reqWin.id,
        bankName: resolvedBankName,
        accountNumber: accountNumber.trim(),

        // Account name comes from authenticated user's profile
        accountName: accountName.trim(),
      });

      setReqWin(null);
      setBankChoice('');
      setCustomBank('');
      setAccountNumber('');

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || t('errors.generic')
      );
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------------------------
  // Check whether withdrawal can be requested
  // ----------------------------------------------------
  const canRequestWithdrawal = (w) => {
    return (
      !w.withdrawalStatus ||
      w.withdrawalStatus === 'unrequested' ||
      w.withdrawalStatus === 'rejected'
    );
  };

  // ----------------------------------------------------
  // Loading
  // ----------------------------------------------------
  if (loading) {
    return (
      <p className="text-gray-500">
        {t('common.loading')}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* No wins */}
      {wins.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('withdrawals.noWins')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('lottery.title')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('lottery.prizeName')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('withdrawals.status')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.actions')}
                </th>

              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {wins.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.lotteryTitle}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.prizeName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill
                      status={
                        w.withdrawalStatus ||
                        'unrequested'
                      }
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                    <button
                      type="button"
                      className={`font-medium py-1.5 px-3 rounded text-sm transition-colors ${
                        canRequestWithdrawal(w)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() =>
                        canRequestWithdrawal(w) &&
                        openRequest(w)
                      }
                      disabled={!canRequestWithdrawal(w)}
                      title={
                        !canRequestWithdrawal(w)
                          ? t('withdrawals.alreadyRequested')
                          : ''
                      }
                    >
                      {w.withdrawalStatus === 'rejected'
                        ? t('withdrawals.resubmit')
                        : t('withdrawals.request')}
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

      {/* ==================================================
          WITHDRAWAL REQUEST MODAL
          ================================================== */}
      {reqWin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !saving && setReqWin(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="mb-5">

              <h3 className="text-lg font-semibold text-gray-900">
                {t('withdrawals.requestForm')}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Choose where your prize should be paid.
              </p>

            </div>

            <form
              onSubmit={submitRequest}
              className="space-y-4"
            >

              {/* Bank / payout method dropdown */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.bankName')}
                </label>

                <select
                  value={bankChoice}
                  onChange={(e) => {
                    setBankChoice(e.target.value);
                    if (e.target.value !== 'other') setCustomBank('');
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select a bank or payment option
                  </option>
                  {BANK_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {bankChoice === 'other' && (
                  <input
                    type="text"
                    value={customBank}
                    onChange={(e) => setCustomBank(e.target.value)}
                    required
                    autoComplete="organization"
                    placeholder="Enter bank name"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}

              </div>

              {/* Account Number / Telebirr phone number */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {bankChoice === 'Telebirr'
                    ? 'Telebirr Phone Number'
                    : t('payments.accountNumber')}
                </label>

                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value)
                  }
                  required
                  autoComplete="off"
                  inputMode={bankChoice === 'Telebirr' ? 'tel' : 'numeric'}
                  placeholder={
                    bankChoice === 'Telebirr'
                      ? 'e.g. 09xxxxxxxx'
                      : 'Enter your bank account number'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              {/* Account Name */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.accountName')}
                </label>

                <input
                  type="text"
                  value={accountName}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                />

                <p className="mt-1 text-xs text-gray-500">
                  This is your registered full name and cannot
                  be changed.
                </p>

              </div>

              {/* Winner Information */}
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">

                <p className="text-xs text-blue-700">
                  <span className="font-semibold">
                    Prize:
                  </span>{' '}
                  {reqWin.prizeName}
                </p>

                <p className="text-xs text-blue-700 mt-1">
                  <span className="font-semibold">
                    Lottery:
                  </span>{' '}
                  {reqWin.lotteryTitle}
                </p>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
                  onClick={() => setReqWin(null)}
                  disabled={saving}
                >
                  {t('users.form.cancel')}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    saving ||
                    !accountName.trim() ||
                    !bankChoice ||
                    (bankChoice === 'other' && !customBank.trim())
                  }
                >
                  {saving
                    ? t('common.saving')
                    : t('withdrawals.request')}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}


// ======================================================
// ADMIN / FINANCE PAYOUT QUEUE
// (unchanged from your version)
// ======================================================

function PayoutQueue() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [payId, setPayId] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/withdrawals/pending');

      setItems(data.withdrawals || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('errors.generic')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function markPaid(e) {
    e.preventDefault();

    setError('');

    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }

    if (!screenshot) {
      setError('Payment screenshot is required.');
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();

      fd.append('transactionId', transactionId.trim());
      fd.append('screenshot', screenshot);

      await api.patch(
        `/withdrawals/${payId}/pay`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPayId(null);
      setTransactionId('');
      setScreenshot(null);

      await load();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('errors.generic')
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitReject(e) {
    e.preventDefault();

    setError('');

    if (!rejectReason.trim()) {
      setError('Please enter a rejection reason.');
      return;
    }

    setSaving(true);

    try {
      await api.patch(
        `/withdrawals/${rejectId}/reject`,
        {
          reason: rejectReason.trim(),
        }
      );

      setRejectId(null);
      setRejectReason('');

      await load();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('errors.generic')
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-gray-500">
        {t('common.loading')}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('withdrawals.empty')}
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.user')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.lottery')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('lottery.prizeName')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.bankName')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.accountNumber')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.actions')}
                </th>

              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {items.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.username ||
                      w.fullName ||
                      w.winnerUserId}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.lotteryTitle}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.prizeName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.bankName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.accountNumber}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {w.accountName || '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">

                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors"
                      onClick={() => {
                        setError('');
                        setTransactionId('');
                        setScreenshot(null);
                        setPayId(w.id);
                      }}
                    >
                      {t('withdrawals.markPaid')}
                    </button>

                    <button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors"
                      onClick={() => {
                        setError('');
                        setRejectReason('');
                        setRejectId(w.id);
                      }}
                    >
                      {t('withdrawals.reject')}
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        </div>
      )}

      {payId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !saving && setPayId(null)}
        >

          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('withdrawals.markPaid')}
            </h3>

            <form
              onSubmit={markPaid}
              className="space-y-4"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.transactionId')}
                </label>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(e.target.value)
                  }
                  required
                  placeholder="Enter transaction ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payments.screenshot')}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setScreenshot(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {screenshot && (
                  <p className="mt-1 text-xs text-gray-500">
                    Selected: {screenshot.name}
                  </p>
                )}

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
                  onClick={() => setPayId(null)}
                  disabled={saving}
                >
                  {t('users.form.cancel')}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    saving ||
                    !transactionId.trim() ||
                    !screenshot
                  }
                >
                  {saving
                    ? t('common.saving')
                    : t('withdrawals.markPaid')}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {rejectId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !saving && setRejectId(null)}
        >

          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('withdrawals.reject')}
            </h3>

            <form
              onSubmit={submitReject}
              className="space-y-4"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('withdrawals.rejectReason')}
                </label>

                <textarea
                  value={rejectReason}
                  onChange={(e) =>
                    setRejectReason(e.target.value)
                  }
                  required
                  rows={4}
                  placeholder="Explain why this withdrawal is rejected..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
                  onClick={() => setRejectId(null)}
                  disabled={saving}
                >
                  {t('users.form.cancel')}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    saving ||
                    !rejectReason.trim()
                  }
                >
                  {saving
                    ? t('common.saving')
                    : t('withdrawals.reject')}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}


// ======================================================
// MAIN WITHDRAWALS PAGE
// ======================================================

export default function Withdrawals() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isFinance =
    !!user &&
    FINANCE_STAFF.includes(user.role);

  const [tab, setTab] = useState('mine');

  return (
    <div className="p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          {t('withdrawals.title')}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage your prize withdrawals and payout requests.
        </p>

      </div>

      {isFinance && (
        <div className="flex gap-1 border-b border-gray-200 mb-6">

          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'mine'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab('mine')}
            type="button"
          >
            {t('withdrawals.myTab')}
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'queue'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab('queue')}
            type="button"
          >
            {t('withdrawals.queueTab')}
          </button>

        </div>
      )}

      {tab === 'mine'
        ? <MyWins />
        : <PayoutQueue />
      }

    </div>
  );
}