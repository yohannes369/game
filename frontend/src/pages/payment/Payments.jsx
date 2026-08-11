// import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// export default function Payments() {
//   const { t } = useTranslation();
//   const [payments, setPayments] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [rejectId, setRejectId] = useState(null);
//   const [reason, setReason] = useState('');
//   const [status, setStatus] = useState('pending');
//   const [messageModal, setMessageModal] = useState({ open: false, userId: null, title: '', body: '' });
//   const [search, setSearch] = useState('');

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get('/payments', { params: { status, search } });
//       setPayments(data.payments || []);
//       setSummary(data.summary || null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [search, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function approve(id) {
//     setError('');
//     try {
//       await api.patch(`/payments/${id}/approve`);
//       await load();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     }
//   }

//   async function reject(e) {
//     e.preventDefault();
//     setError('');
//     try {
//       await api.patch(`/payments/${rejectId}/reject`, { reason });
//       setRejectId(null);
//       setReason('');
//       await load();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {t('payments.pendingTitle')}
//           </h2>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-800 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Controls Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="space-y-3">
//               <strong className="text-lg font-semibold text-gray-900">
//                 {t('payments.pendingTitle')}
//               </strong>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
//                     status === 'pending'
//                       ? 'bg-blue-600 text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                   onClick={() => setStatus('pending')}
//                 >
//                   {t('payments.pendingShort')}
//                 </button>
//                 <button
//                   className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
//                     status === 'approved'
//                       ? 'bg-green-600 text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                   onClick={() => setStatus('approved')}
//                 >
//                   {t('payments.approvedShort')}
//                 </button>
//                 <button
//                   className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
//                     status === 'rejected'
//                       ? 'bg-red-600 text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                   onClick={() => setStatus('rejected')}
//                 >
//                   {t('payments.rejectedShort')}
//                 </button>
//                 <button
//                   className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
//                     status === 'all'
//                       ? 'bg-purple-600 text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                   onClick={() => setStatus('all')}
//                 >
//                   {t('payments.all')}
//                 </button>
//               </div>
//               {summary && (
//                 <p className="text-sm text-gray-500">
//                   {summary.totalPayments || 0} payments • {Number(summary.totalAmount || 0).toFixed(2)} Birr
//                 </p>
//               )}
//             </div>

//             <div className="w-full lg:w-72">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {t('common.search')}
//               </label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by user, lottery, or transaction"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : payments.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//             <p className="text-gray-500 text-lg">{t('payments.empty')}</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             {/* Mobile Card View */}
//             <div className="block lg:hidden">
//               <div className="divide-y divide-gray-200">
//                 {payments.map((p) => (
//                   <div key={p.id} className="p-4 space-y-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-semibold text-gray-900">
//                           {p.full_name || p.username || p.userId}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {p.lottery_name || p.lotteryId}
//                         </p>
//                       </div>
//                       <span className="font-bold text-lg text-gray-900">
//                         {p.amount} Birr
//                       </span>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <span className="text-gray-500">Tickets:</span>
//                         <p className="text-gray-900">
//                           {(p.ticketNumbers && p.ticketNumbers.length > 0) 
//                             ? p.ticketNumbers.join(', ') 
//                             : (p.ticket_numbers || 'N/A')}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Method:</span>
//                         <p className="text-gray-900 capitalize">
//                           {t(`payments.methods.${p.method}`, p.method)}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Transaction:</span>
//                         <p className="text-gray-900 text-xs truncate">
//                           {p.transaction_id || p.transactionId || 'N/A'}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Date:</span>
//                         <p className="text-gray-900 text-xs">
//                           {p.createdAtEt || p.created_at}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 pt-2">
//                       {status === 'pending' && (
//                         <>
//                           <button
//                             className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                             onClick={() => approve(p.id)}
//                           >
//                             {t('payments.approve')}
//                           </button>
//                           <button
//                             className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                             onClick={() => setRejectId(p.id)}
//                           >
//                             {t('payments.reject')}
//                           </button>
//                         </>
//                       )}
//                       <button
//                         className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={() => setMessageModal({ open: true, userId: p.user_id || p.userId || p.userId, title: '', body: '' })}
//                       >
//                         {t('payments.message')}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Desktop Table View */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.user')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.lottery')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.tickets')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.amount')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.method')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.transactionId')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('payments.table.submitted')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('users.table.actions')}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {payments.map((p) => (
//                     <tr key={p.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-medium text-gray-900">
//                           {p.full_name || p.username || p.userId}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm text-gray-900">
//                           {p.lottery_name || p.lotteryId}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-gray-900">
//                           {(p.ticketNumbers && p.ticketNumbers.length > 0) 
//                             ? p.ticketNumbers.join(', ') 
//                             : (p.ticket_numbers || '')}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-semibold text-gray-900">
//                           {p.amount} Birr
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm text-gray-900 capitalize">
//                           {t(`payments.methods.${p.method}`, p.method)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm text-gray-500 font-mono">
//                           {p.transaction_id || p.transactionId || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm text-gray-500">
//                           {p.createdAtEt || p.created_at}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex gap-2">
//                           {status === 'pending' && (
//                             <>
//                               <button
//                                 className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
//                                 onClick={() => approve(p.id)}
//                               >
//                                 {t('payments.approve')}
//                               </button>
//                               <button
//                                 className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
//                                 onClick={() => setRejectId(p.id)}
//                               >
//                                 {t('payments.reject')}
//                               </button>
//                             </>
//                           )}
//                           <button
//                             className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                             onClick={() => setMessageModal({ open: true, userId: p.user_id || p.userId || p.userId, title: '', body: '' })}
//                           >
//                             {t('payments.message')}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Reject Modal */}
//         {rejectId && (
//           <div 
//             className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//             onClick={() => setRejectId(null)}
//           >
//             <div 
//               className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-4">
//                 {t('payments.reject')}
//               </h3>
//               <form onSubmit={reject} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('payments.rejectReason')}
//                   </label>
//                   <input
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     placeholder="Enter rejection reason..."
//                   />
//                 </div>
//                 <div className="flex gap-3 justify-end">
//                   <button
//                     type="button"
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                     onClick={() => setRejectId(null)}
//                   >
//                     {t('users.form.cancel')}
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     {t('payments.reject')}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Message Modal */}
//         {messageModal.open && (
//           <div 
//             className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//             onClick={() => setMessageModal({ open: false, userId: null, title: '', body: '' })}
//           >
//             <div 
//               className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-4">
//                 {t('payments.messageUser')}
//               </h3>
//               <form
//                 onSubmit={async (e) => {
//                   e.preventDefault();
//                   setError('');
//                   try {
//                     await api.post('/notifications/send', {
//                       userId: messageModal.userId,
//                       title: messageModal.title,
//                       body: messageModal.body,
//                     });
//                     setMessageModal({ open: false, userId: null, title: '', body: '' });
//                   } catch (err) {
//                     setError(err.response?.data?.message || t('errors.generic'));
//                   }
//                 }}
//                 className="space-y-4"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('payments.messageTitle')}
//                   </label>
//                   <input
//                     value={messageModal.title}
//                     onChange={(e) => setMessageModal({ ...messageModal, title: e.target.value })}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Message title..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('payments.messageBody')}
//                   </label>
//                   <textarea
//                     value={messageModal.body}
//                     onChange={(e) => setMessageModal({ ...messageModal, body: e.target.value })}
//                     required
//                     rows="4"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//                     placeholder="Message content..."
//                   />
//                 </div>
//                 <div className="flex gap-3 justify-end">
//                   <button
//                     type="button"
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                     onClick={() => setMessageModal({ open: false, userId: null, title: '', body: '' })}
//                   >
//                     {t('users.form.cancel')}
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {t('payments.send')}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

const isAbsoluteUrl = (value) => typeof value === 'string' && /^(https?:)?\/\//i.test(value);
const normalizeUploadUrl = (value) => {
  if (!value || typeof value !== 'string') return null;
  if (isAbsoluteUrl(value)) return value;
  return `${UPLOADS_BASE_URL.replace(/\/+$/, '')}/${value.replace(/^\/+/, '')}`;
};

// Pull the screenshot/proof URL from whatever field name the backend uses.
// Add/remove keys here if your API uses a different field name.
function getScreenshotUrl(p) {
  const raw =
    p.screenshotUrl ||
    p.screenshot_url ||
    p.screenshotPath ||
    p.screenshot_path ||
    p.screenshot ||
    p.receiptUrl ||
    p.receipt_url ||
    p.proofUrl ||
    p.proof_url ||
    p.paymentProof ||
    null;

  return normalizeUploadUrl(raw);
}

export default function Payments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('pending');
  const [messageModal, setMessageModal] = useState({ open: false, userId: null, title: '', body: '' });
  const [search, setSearch] = useState('');
  const [screenshotModal, setScreenshotModal] = useState(null); // { url, label } | null

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/payments', { params: { status, search } });
      setPayments(data.payments || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [search, status, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(id) {
    setError('');
    try {
      await api.patch(`/payments/${id}/approve`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  async function reject(e) {
    e.preventDefault();
    setError('');
    try {
      // `reason` is sent to the backend and should be stored against the
      // payment so MyOrders.jsx can show it to the user later.
      await api.patch(`/payments/${rejectId}/reject`, { reason });
      setRejectId(null);
      setReason('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  // Payments that actually have a screenshot, for the quick-review strip
  // shown above the table. Works for pending/approved/rejected/all — it
  // just reflects whatever `status` tab is currently selected.
  const withScreenshots = payments
    .map((p) => ({ p, url: getScreenshotUrl(p) }))
    .filter((row) => row.url);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('payments.pendingTitle')}
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Controls Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <strong className="text-lg font-semibold text-gray-900">
                {status === 'pending'
                  ? t('payments.pendingTitle')
                  : t('payments.historyTitle', 'Payment History')}
              </strong>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    status === 'pending'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatus('pending')}
                >
                  {t('payments.pendingShort')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    status === 'approved'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatus('approved')}
                >
                  {t('payments.approvedShort')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    status === 'rejected'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatus('rejected')}
                >
                  {t('payments.rejectedShort')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    status === 'all'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatus('all')}
                >
                  {t('payments.all')}
                </button>
              </div>
              {summary && (
                <p className="text-sm text-gray-500">
                  {summary.totalPayments || 0} payments • {Number(summary.totalAmount || 0).toFixed(2)} Birr
                </p>
              )}
            </div>

            <div className="w-full lg:w-72">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.search')}
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, lottery, or transaction"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Screenshot Quick-Review Strip — shown BEFORE the list, for all tabs
            (pending, approved, rejected, all) so the admin can eyeball proofs
            fast without opening every row. */}
        {!loading && withScreenshots.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('payments.proofPreview', 'Payment Proofs')} ({withScreenshots.length})
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {withScreenshots.map(({ p, url }) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setScreenshotModal({
                      url,
                      label: p.full_name || p.username || p.userId,
                    })
                  }
                  className="shrink-0 flex flex-col items-center gap-1"
                >
                  <img
                    src={url}
                    alt="Payment proof"
                    className="h-20 w-20 rounded-lg object-cover border border-gray-200 hover:opacity-80 hover:ring-2 hover:ring-blue-400 transition-all"
                  />
                  <span className="max-w-[80px] truncate text-[10px] text-gray-500">
                    {p.full_name || p.username || p.userId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">{t('payments.empty')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="divide-y divide-gray-200">
                {payments.map((p) => {
                  const screenshotUrl = getScreenshotUrl(p);
                  return (
                    <div key={p.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3">
                          {/* Screenshot thumbnail */}
                          {screenshotUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                setScreenshotModal({
                                  url: screenshotUrl,
                                  label: p.full_name || p.username || p.userId,
                                })
                              }
                              className="shrink-0"
                            >
                              <img
                                src={screenshotUrl}
                                alt="Payment proof"
                                className="h-14 w-14 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
                              />
                            </button>
                          ) : (
                            <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-[10px] text-center px-1">
                              {t('payments.noScreenshot', 'No proof')}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {p.full_name || p.username || p.userId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {p.lottery_name || p.lotteryId}
                            </p>
                            {status !== 'pending' && (
                              <span
                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                                  p.status === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : p.status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {p.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
                          {p.amount} Birr
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Tickets:</span>
                          <p className="text-gray-900">
                            {(p.ticketNumbers && p.ticketNumbers.length > 0)
                              ? p.ticketNumbers.join(', ')
                              : (p.ticket_numbers || 'N/A')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Method:</span>
                          <p className="text-gray-900 capitalize">
                            {t(`payments.methods.${p.method}`, p.method)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Transaction:</span>
                          <p className="text-gray-900 text-xs truncate">
                            {p.transaction_id || p.transactionId || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="text-gray-900 text-xs">
                            {p.createdAtEt || p.created_at}
                          </p>
                        </div>
                      </div>

                      {/* Rejection reason (history view) */}
                      {p.status === 'rejected' && (p.rejection_reason || p.rejectionReason) && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                          {t('payments.rejectReason')}: {p.rejection_reason || p.rejectionReason}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        {status === 'pending' && (
                          <>
                            <button
                              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                              onClick={() => approve(p.id)}
                            >
                              {t('payments.approve')}
                            </button>
                            <button
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                              onClick={() => setRejectId(p.id)}
                            >
                              {t('payments.reject')}
                            </button>
                          </>
                        )}
                        <button
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          onClick={() => setMessageModal({ open: true, userId: p.user_id || p.userId, title: '', body: '' })}
                        >
                          {t('payments.message')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.proof', 'Proof')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.lottery')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.tickets')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.amount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.method')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.transactionId')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payments.table.submitted')}
                    </th>
                    {status !== 'pending' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.table.status', 'Status')}
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((p) => {
                    const screenshotUrl = getScreenshotUrl(p);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {screenshotUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                setScreenshotModal({
                                  url: screenshotUrl,
                                  label: p.full_name || p.username || p.userId,
                                })
                              }
                            >
                              <img
                                src={screenshotUrl}
                                alt="Payment proof"
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
                              />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {t('payments.noScreenshot', 'No proof')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {p.full_name || p.username || p.userId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {p.lottery_name || p.lotteryId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {(p.ticketNumbers && p.ticketNumbers.length > 0)
                              ? p.ticketNumbers.join(', ')
                              : (p.ticket_numbers || '')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {p.amount} Birr
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">
                            {t(`payments.methods.${p.method}`, p.method)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 font-mono">
                            {p.transaction_id || p.transactionId || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {p.createdAtEt || p.created_at}
                          </span>
                        </td>
                        {status !== 'pending' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                p.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : p.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {p.status}
                            </span>
                            {p.status === 'rejected' && (p.rejection_reason || p.rejectionReason) && (
                              <p className="mt-1 max-w-[200px] text-xs text-red-600">
                                {p.rejection_reason || p.rejectionReason}
                              </p>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {status === 'pending' && (
                              <>
                                <button
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                                  onClick={() => approve(p.id)}
                                >
                                  {t('payments.approve')}
                                </button>
                                <button
                                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                  onClick={() => setRejectId(p.id)}
                                >
                                  {t('payments.reject')}
                                </button>
                              </>
                            )}
                            <button
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                              onClick={() => setMessageModal({ open: true, userId: p.user_id || p.userId, title: '', body: '' })}
                            >
                              {t('payments.message')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Screenshot / Proof-of-payment Modal */}
        {screenshotModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setScreenshotModal(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {t('payments.paymentProof', 'Payment Proof')} — {screenshotModal.label}
                </h3>
                <button
                  onClick={() => setScreenshotModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <img
                src={screenshotModal.url}
                alt="Payment proof full size"
                className="w-full max-h-[75vh] object-contain rounded-lg border border-gray-200"
              />
              <div className="mt-3 text-right">
                <a
                  href={screenshotModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {t('payments.openFullImage', 'Open full image')}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectId && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setRejectId(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('payments.reject')}
              </h3>
              <form onSubmit={reject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.rejectReason')}
                  </label>
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter rejection reason..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('payments.rejectReasonHint', 'The user will see this reason on their My Orders page.')}
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setRejectId(null)}
                  >
                    {t('users.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('payments.reject')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModal.open && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setMessageModal({ open: false, userId: null, title: '', body: '' })}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('payments.messageUser')}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');
                  try {
                    await api.post('/notifications/send', {
                      userId: messageModal.userId,
                      title: messageModal.title,
                      body: messageModal.body,
                    });
                    setMessageModal({ open: false, userId: null, title: '', body: '' });
                  } catch (err) {
                    setError(err.response?.data?.message || t('errors.generic'));
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.messageTitle')}
                  </label>
                  <input
                    value={messageModal.title}
                    onChange={(e) => setMessageModal({ ...messageModal, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Message title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.messageBody')}
                  </label>
                  <textarea
                    value={messageModal.body}
                    onChange={(e) => setMessageModal({ ...messageModal, body: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Message content..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setMessageModal({ open: false, userId: null, title: '', body: '' })}
                  >
                    {t('users.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('payments.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}