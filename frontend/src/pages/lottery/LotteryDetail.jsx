

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';
// import Countdown from '../../components/Countdown';

// const CAN_MANAGE = ['admin', 'lottery_manager'];
// const DELETE_ROLES = ['admin']; // only admin can delete a lottery
// const STATUS_FLOW = ['draft', 'active', 'locked', 'completed'];
// const PAYMENT_METHODS = ['telebirr', 'cbe_birr', 'bank_transfer', 'other'];

// // Ticket sales cut off this many minutes before the scheduled spin.
// const AUTO_LOCK_MINUTES = 2;
// const AUTO_LOCK_MS = AUTO_LOCK_MINUTES * 60 * 1000;

// function PaymentForm({ lottery, onSubmitted, closingSoon }) {
//   const { t } = useTranslation();
//   const isPackageMode = lottery.ticketMode === 'package';
//   const [packageId, setPackageId] = useState('');
//   const [amount, setAmount] = useState('');
//   const [method, setMethod] = useState(PAYMENT_METHODS[0]);
//   const [senderName, setSenderName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [transactionId, setTransactionId] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [saving, setSaving] = useState(false);

//   const previewAmount = isPackageMode
//     ? lottery.packages?.find((p) => String(p.id) === String(packageId))?.price
//     : amount;

//   const previewTickets =
//     !isPackageMode && lottery.ticketMode === 'custom' && amount && lottery.ticketPrice
//       ? Math.floor(Number(amount) / Number(lottery.ticketPrice))
//       : null;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setSaving(true);

//     try {
//       const finalAmount = isPackageMode ? previewAmount : amount;
//       const fd = new FormData();
//       fd.append('lotteryId', lottery.id);
//       fd.append('amount', finalAmount);
//       fd.append('method', method);
//       fd.append('senderName', senderName);
//       fd.append('phoneNumber', phoneNumber);
//       fd.append('transactionId', transactionId);

//       if (isPackageMode) {
//         fd.append('packageId', packageId);
//       }
//       if (screenshot) {
//         fd.append('screenshot', screenshot);
//       }

//       await api.post('/payments', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setSuccess(t('payments.submitSuccess'));
//       setPackageId('');
//       setAmount('');
//       setSenderName('');
//       setPhoneNumber('');
//       setTransactionId('');
//       setScreenshot(null);
//       onSubmitted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="card">
//       <h3>{t('payments.buyTickets')}</h3>
//       {closingSoon && (
//         <div className="alert alert-error">
//           {t('payments.closingSoon', {
//             defaultValue: `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
//             minutes: AUTO_LOCK_MINUTES,
//           })}
//         </div>
//       )}
//       {error && <div className="alert alert-error">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={handleSubmit} className="form">
//         {isPackageMode ? (
//           <div className="package-grid">
//             {(lottery.packages || []).map((p) => (
//               <div
//                 key={p.id}
//                 className={`package-card${String(packageId) === String(p.id) ? ' selected' : ''}`}
//                 onClick={() => setPackageId(p.id)}
//               >
//                 <div className="package-name">{p.name}</div>
//                 <div className="package-price">{p.price}</div>
//                 <div className="muted">
//                   {p.ticketCount} {t('lottery.tickets')}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <label className="field">
//             <span>{t('payments.amount')}</span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//             />
//             {previewTickets !== null && (
//               <small>{t('payments.ticketsPreview', { count: previewTickets })}</small>
//             )}
//           </label>
//         )}

//         <label className="field">
//           <span>{t('payments.method')}</span>
//           <select value={method} onChange={(e) => setMethod(e.target.value)} required>
//             {PAYMENT_METHODS.map((m) => (
//               <option key={m} value={m}>
//                 {t(`payments.methods.${m}`)}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="field">
//           <span>{t('payments.senderName')}</span>
//           <input
//             type="text"
//             value={senderName}
//             onChange={(e) => setSenderName(e.target.value)}
//             required
//           />
//         </label>

//         <label className="field">
//           <span>{t('payments.phoneNumber')}</span>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//         </label>

//         <label className="field">
//           <span>{t('payments.transactionId')}</span>
//           <input
//             type="text"
//             value={transactionId}
//             onChange={(e) => setTransactionId(e.target.value)}
//             required
//           />
//         </label>

//         <label className="field">
//           <span>{t('payments.screenshot')}</span>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
//           />
//         </label>

//         {previewAmount && (
//           <p className="muted">
//             {t('payments.total')}: {previewAmount}
//           </p>
//         )}

//         <div className="modal-actions">
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={saving || closingSoon || (isPackageMode && !packageId)}
//           >
//             {saving ? t('common.saving') : t('payments.submit')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function ManagePanel({ lottery, user, onChanged, onDeleted }) {
//   const { t } = useTranslation();
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [ticketCount, setTicketCount] = useState('');
//   const [error, setError] = useState('');
//   const [busy, setBusy] = useState(false);

//   const canDelete = user && DELETE_ROLES.includes(user.role);

//   async function addPackage(e) {
//     e.preventDefault();
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/lotteries/${lottery.id}/packages`, {
//         name,
//         price: Number(price),
//         ticketCount: Number(ticketCount),
//       });
//       setName('');
//       setPrice('');
//       setTicketCount('');
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function changeStatus(status) {
//     setError('');
//     setBusy(true);
//     try {
//       await api.patch(`/lotteries/${lottery.id}/status`, { status });
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function triggerDraw() {
//     if (!window.confirm(t('lottery.confirmDraw'))) return;
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/winners/lottery/${lottery.id}/draw`);
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function deleteLottery() {
//     const confirmMsg = t('lottery.confirmDelete', {
//       defaultValue: 'Delete this lottery? This action cannot be undone.',
//     });
//     if (!window.confirm(confirmMsg)) return;

//     setError('');
//     setBusy(true);
//     try {
//       await api.delete(`/lotteries/${lottery.id}`);
//       onDeleted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="card">
//       <h3>{t('lottery.manage')}</h3>
//       {error && <div className="alert alert-error">{error}</div>}

//       <div className="actions" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
//         {STATUS_FLOW.map((s) => (
//           <button
//             key={s}
//             type="button"
//             className={s === lottery.status ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
//             disabled={busy || s === lottery.status}
//             onClick={() => changeStatus(s)}
//           >
//             {t(`status.${s}`)}
//           </button>
//         ))}
//         <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={triggerDraw}>
//           {t('lottery.drawNow')}
//         </button>

//         {canDelete && (
//           <button
//             type="button"
//             className="btn btn-danger btn-sm"
//             disabled={busy}
//             onClick={deleteLottery}
//           >
//             {t('lottery.deleteLottery', { defaultValue: 'Delete Lottery' })}
//           </button>
//         )}
//       </div>

//       {lottery.ticketMode === 'package' && (
//         <form onSubmit={addPackage} className="form">
//           <span className="muted">{t('lottery.form.addPackage')}</span>
//           <label className="field">
//             <span>{t('lottery.form.packageName')}</span>
//             <input value={name} onChange={(e) => setName(e.target.value)} required />
//           </label>
//           <label className="field">
//             <span>{t('lottery.form.packagePrice')}</span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//             />
//           </label>
//           <label className="field">
//             <span>{t('lottery.form.packageTickets')}</span>
//             <input
//               type="number"
//               min="1"
//               value={ticketCount}
//               onChange={(e) => setTicketCount(e.target.value)}
//               required
//             />
//           </label>
//           <div className="modal-actions">
//             <button type="submit" className="btn btn-primary" disabled={busy}>
//               {t('lottery.form.save')}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

// export default function LotteryDetail() {
//   const { id } = useParams();
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [lottery, setLottery] = useState(null);
//   const [dashboard, setDashboard] = useState(null);
//   const [tickets, setTickets] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [closingSoon, setClosingSoon] = useState(false);
//   const autoLockingRef = useRef(false);

//   const load = useCallback(async () => {
//     try {
//       const requests = [api.get(`/lotteries/${id}`)];
//       if (user) {
//         requests.push(api.get(`/lotteries/${id}/dashboard`));
//         requests.push(api.get(`/tickets/lottery/${id}/mine`));
//       }
//       const results = await Promise.allSettled(requests);

//       if (results[0].status === 'fulfilled') {
//         setLottery(results[0].value.data.lottery);
//       } else {
//         setError(results[0].reason?.response?.data?.message || t('errors.generic'));
//       }
//       if (user && results[1]?.status === 'fulfilled') {
//         setDashboard(results[1].value.data);
//       }
//       if (user && results[2]?.status === 'fulfilled') {
//         setTickets(results[2].value.data.tickets || []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [id, user, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   // Auto-lock: once the lottery is active and the spin time is within
//   // AUTO_LOCK_MINUTES, flip it to "locked" so no more payments can be
//   // submitted right before the draw. Ideally this would be a backend cron
//   // job so it fires even with nobody viewing the page, but until that
//   // exists this keeps it enforced for anyone with the detail page open.
//   useEffect(() => {
//     if (!lottery?.spinAt) {
//       setClosingSoon(false);
//       return undefined;
//     }

//     const canManage = user && CAN_MANAGE.includes(user.role);
//     const spinTime = new Date(lottery.spinAt).getTime();

//     function tick() {
//       const msLeft = spinTime - Date.now();
//       const withinLockWindow = msLeft > 0 && msLeft <= AUTO_LOCK_MS;

//       setClosingSoon(lottery.status === 'active' && withinLockWindow);

//       if (
//         canManage &&
//         lottery.status === 'active' &&
//         withinLockWindow &&
//         !autoLockingRef.current
//       ) {
//         autoLockingRef.current = true;
//         api
//           .patch(`/lotteries/${id}/status`, { status: 'locked' })
//           .then(() => load())
//           .catch(() => {
//             // will retry on the next tick if it's still within the window
//             autoLockingRef.current = false;
//           });
//       }
//     }

//     tick();
//     const intervalId = setInterval(tick, 5000);
//     return () => clearInterval(intervalId);
//   }, [lottery?.spinAt, lottery?.status, user, id, load]);

//   function handleDeleted() {
//     // lottery removed on the server, send the user back to the list
//     navigate('/lotteries');
//   }

//   if (loading) return <p className="muted page">{t('common.loading')}</p>;
//   if (error) return <div className="page alert alert-error">{error}</div>;
//   if (!lottery) return null;

//   const canManage = user && CAN_MANAGE.includes(user.role);

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div>
//           <h2>{lottery.name}</h2>
//           {lottery.description && <p className="muted">{lottery.description}</p>}
//         </div>
//         <StatusPill status={lottery.status} />
//       </div>

//       <div className="stat-grid" style={{ marginBottom: '1.25rem' }}>
//         <div className="stat-card">
//           <div className="stat-label">{t('lottery.ticketPrice')}</div>
//           <div className="stat-value">{lottery.ticketPrice}</div>
//         </div>
//         {lottery.spinAtEt && (
//           <div className="stat-card">
//             <div className="stat-label">{t('lottery.spinAt')}</div>
//             <div className="stat-value">{lottery.spinAtEt}</div>
//           </div>
//         )}
//         {dashboard?.ticketsSold !== undefined && (
//           <div className="stat-card">
//             <div className="stat-label">{t('lottery.ticketsSold')}</div>
//             <div className="stat-value">{dashboard.ticketsSold}</div>
//           </div>
//         )}
//         {dashboard?.myTickets !== undefined && (
//           <div className="stat-card">
//             <div className="stat-label">{t('lottery.myTickets')}</div>
//             <div className="stat-value">{dashboard.myTickets}</div>
//           </div>
//         )}
//         {dashboard?.myOdds !== undefined && (
//           <div className="stat-card">
//             <div className="stat-label">{t('lottery.myOdds')}</div>
//             <div className="stat-value">{dashboard.myOdds}</div>
//           </div>
//         )}
//       </div>

//       {lottery.spinAt && lottery.status === 'active' && (
//         <div className="card" style={{ marginBottom: '1.25rem' }}>
//           <div className="stat-label" style={{ marginBottom: '0.5rem' }}>
//             {t('lottery.countdownTo')}
//           </div>
//           <Countdown target={lottery.spinAt} />
//           {closingSoon && (
//             <p className="alert alert-error" style={{ marginTop: '0.75rem' }}>
//               {t('lottery.closingSoon', {
//                 defaultValue: `Sales close automatically ${AUTO_LOCK_MINUTES} minutes before the spin.`,
//                 minutes: AUTO_LOCK_MINUTES,
//               })}
//             </p>
//           )}
//         </div>
//       )}

//       {lottery.prizes?.length > 0 && (
//         <div className="card" style={{ marginBottom: '1.25rem' }}>
//           <h3>{t('lottery.prizes')}</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>{t('lottery.prizeTier')}</th>
//                 <th>{t('lottery.prizeName')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lottery.prizes.map((p) => (
//                 <tr key={p.id}>
//                   <td>{p.rank_position}</td>
//                   <td>{p.prize_amount} Birr{p.label ? ` (${p.label})` : ''}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {user && lottery.status === 'active' && (
//         <div style={{ marginBottom: '1.25rem' }}>
//           <PaymentForm lottery={lottery} onSubmitted={load} closingSoon={closingSoon} />
//         </div>
//       )}

//       {user && tickets.length > 0 && (
//         <div className="card" style={{ marginBottom: '1.25rem' }}>
//           <h3>{t('lottery.myTickets')}</h3>
//           <div className="actions" style={{ flexWrap: 'wrap' }}>
//             {tickets.map((tk) => (
//               <span key={tk.id} className="badge badge-group_leader">
//                 {tk.ticketNumber}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {canManage && (
//         <ManagePanel lottery={lottery} user={user} onChanged={load} onDeleted={handleDeleted} />
//       )}
//     </div>
//   );
// }

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';
// import Countdown from '../../components/Countdown';

// const CAN_MANAGE = ['admin', 'lottery_manager'];
// const DELETE_ROLES = ['admin']; // only admin can delete a lottery
// const STATUS_FLOW = ['draft', 'active', 'locked', 'completed'];
// const PAYMENT_METHODS = ['telebirr', 'cbe_birr', 'bank_transfer', 'other'];

// // Ticket sales cut off this many minutes before the scheduled spin.
// const AUTO_LOCK_MINUTES = 2;
// const AUTO_LOCK_MS = AUTO_LOCK_MINUTES * 60 * 1000;

// function PaymentForm({ lottery, onSubmitted, closingSoon }) {
//   const { t } = useTranslation();
//   const isPackageMode = lottery.ticketMode === 'package';
//   const [packageId, setPackageId] = useState('');
//   const [amount, setAmount] = useState('');
//   const [method, setMethod] = useState(PAYMENT_METHODS[0]);
//   const [senderName, setSenderName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [transactionId, setTransactionId] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [saving, setSaving] = useState(false);

//   const previewAmount = isPackageMode
//     ? lottery.packages?.find((p) => String(p.id) === String(packageId))?.price
//     : amount;

//   const previewTickets =
//     !isPackageMode && lottery.ticketMode === 'custom' && amount && lottery.ticketPrice
//       ? Math.floor(Number(amount) / Number(lottery.ticketPrice))
//       : null;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setSaving(true);

//     try {
//       const finalAmount = isPackageMode ? previewAmount : amount;
//       const fd = new FormData();
//       fd.append('lotteryId', lottery.id);
//       fd.append('amount', finalAmount);
//       fd.append('method', method);
//       fd.append('senderName', senderName);
//       fd.append('phoneNumber', phoneNumber);
//       fd.append('transactionId', transactionId);

//       if (isPackageMode) {
//         fd.append('packageId', packageId);
//       }
//       if (screenshot) {
//         fd.append('screenshot', screenshot);
//       }

//       await api.post('/payments', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setSuccess(t('payments.submitSuccess'));
//       setPackageId('');
//       setAmount('');
//       setSenderName('');
//       setPhoneNumber('');
//       setTransactionId('');
//       setScreenshot(null);
//       onSubmitted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//       <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//         {t('payments.buyTickets')}
//       </h3>

//       {closingSoon && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {t('payments.closingSoon', {
//             defaultValue: `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
//             minutes: AUTO_LOCK_MINUTES,
//           })}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {isPackageMode ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {(lottery.packages || []).map((p) => {
//               const isSelected = String(packageId) === String(p.id);
//               return (
//                 <div
//                   key={p.id}
//                   onClick={() => setPackageId(p.id)}
//                   className={`cursor-pointer rounded-lg border p-4 transition-all ${
//                     isSelected
//                       ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30'
//                       : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
//                   }`}
//                 >
//                   <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
//                   <div className="my-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
//                     {p.price}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {p.ticketCount} {t('lottery.tickets')}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('payments.amount')}
//             </span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//             {previewTickets !== null && (
//               <small className="block text-xs text-gray-500 dark:text-gray-400">
//                 {t('payments.ticketsPreview', { count: previewTickets })}
//               </small>
//             )}
//           </label>
//         )}

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.method')}
//           </span>
//           <select
//             value={method}
//             onChange={(e) => setMethod(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           >
//             {PAYMENT_METHODS.map((m) => (
//               <option key={m} value={m}>
//                 {t(`payments.methods.${m}`)}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.senderName')}
//           </span>
//           <input
//             type="text"
//             value={senderName}
//             onChange={(e) => setSenderName(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.phoneNumber')}
//           </span>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.transactionId')}
//           </span>
//           <input
//             type="text"
//             value={transactionId}
//             onChange={(e) => setTransactionId(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.screenshot')}
//           </span>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-950 dark:file:text-indigo-300"
//           />
//         </label>

//         {previewAmount && (
//           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             {t('payments.total')}: {previewAmount}
//           </p>
//         )}

//         <div className="flex justify-end pt-2">
//           <button
//             type="submit"
//             disabled={saving || closingSoon || (isPackageMode && !packageId)}
//             className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {saving ? t('common.saving') : t('payments.submit')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function ManagePanel({ lottery, user, onChanged, onDeleted }) {
//   const { t } = useTranslation();
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [ticketCount, setTicketCount] = useState('');
//   const [error, setError] = useState('');
//   const [busy, setBusy] = useState(false);

//   const canDelete = user && DELETE_ROLES.includes(user.role);

//   async function addPackage(e) {
//     e.preventDefault();
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/lotteries/${lottery.id}/packages`, {
//         name,
//         price: Number(price),
//         ticketCount: Number(ticketCount),
//       });
//       setName('');
//       setPrice('');
//       setTicketCount('');
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function changeStatus(status) {
//     setError('');
//     setBusy(true);
//     try {
//       await api.patch(`/lotteries/${lottery.id}/status`, { status });
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function triggerDraw() {
//     if (!window.confirm(t('lottery.confirmDraw'))) return;
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/winners/lottery/${lottery.id}/draw`);
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function deleteLottery() {
//     const confirmMsg = t('lottery.confirmDelete', {
//       defaultValue: 'Delete this lottery? This action cannot be undone.',
//     });
//     if (!window.confirm(confirmMsg)) return;

//     setError('');
//     setBusy(true);
//     try {
//       await api.delete(`/lotteries/${lottery.id}`);
//       onDeleted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//       <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//         {t('lottery.manage')}
//       </h3>
//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       <div className="mb-6 flex flex-wrap gap-2">
//         {STATUS_FLOW.map((s) => {
//           const isActiveStatus = s === lottery.status;
//           return (
//             <button
//               key={s}
//               type="button"
//               disabled={busy || isActiveStatus}
//               onClick={() => changeStatus(s)}
//               className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
//                 isActiveStatus
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//               }`}
//             >
//               {t(`status.${s}`)}
//             </button>
//           );
//         })}
//         <button
//           type="button"
//           disabled={busy}
//           onClick={triggerDraw}
//           className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {t('lottery.drawNow')}
//         </button>

//         {canDelete && (
//           <button
//             type="button"
//             disabled={busy}
//             onClick={deleteLottery}
//             className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {t('lottery.deleteLottery', { defaultValue: 'Delete Lottery' })}
//           </button>
//         )}
//       </div>

//       {lottery.ticketMode === 'package' && (
//         <form onSubmit={addPackage} className="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
//           <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
//             {t('lottery.form.addPackage')}
//           </span>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packageName')}
//             </span>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packagePrice')}
//             </span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packageTickets')}
//             </span>
//             <input
//               type="number"
//               min="1"
//               value={ticketCount}
//               onChange={(e) => setTicketCount(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={busy}
//               className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {t('lottery.form.save')}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

// export default function LotteryDetail() {
//   const { id } = useParams();
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [lottery, setLottery] = useState(null);
//   const [dashboard, setDashboard] = useState(null);
//   const [tickets, setTickets] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [closingSoon, setClosingSoon] = useState(false);
//   const autoLockingRef = useRef(false);

//   const load = useCallback(async () => {
//     try {
//       const requests = [api.get(`/lotteries/${id}`)];
//       if (user) {
//         requests.push(api.get(`/lotteries/${id}/dashboard`));
//         requests.push(api.get(`/tickets/lottery/${id}/mine`));
//       }
//       const results = await Promise.allSettled(requests);

//       if (results[0].status === 'fulfilled') {
//         setLottery(results[0].value.data.lottery);
//       } else {
//         setError(results[0].reason?.response?.data?.message || t('errors.generic'));
//       }
//       if (user && results[1]?.status === 'fulfilled') {
//         setDashboard(results[1].value.data);
//       }
//       if (user && results[2]?.status === 'fulfilled') {
//         setTickets(results[2].value.data.tickets || []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [id, user, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     if (!lottery?.spinAt) {
//       setClosingSoon(false);
//       return undefined;
//     }

//     const canManage = user && CAN_MANAGE.includes(user.role);
//     const spinTime = new Date(lottery.spinAt).getTime();

//     function tick() {
//       const msLeft = spinTime - Date.now();
//       const withinLockWindow = msLeft > 0 && msLeft <= AUTO_LOCK_MS;

//       setClosingSoon(lottery.status === 'active' && withinLockWindow);

//       if (
//         canManage &&
//         lottery.status === 'active' &&
//         withinLockWindow &&
//         !autoLockingRef.current
//       ) {
//         autoLockingRef.current = true;
//         api
//           .patch(`/lotteries/${id}/status`, { status: 'locked' })
//           .then(() => load())
//           .catch(() => {
//             autoLockingRef.current = false;
//           });
//       }
//     }

//     tick();
//     const intervalId = setInterval(tick, 5000);
//     return () => clearInterval(intervalId);
//   }, [lottery?.spinAt, lottery?.status, user, id, load]);

//   function handleDeleted() {
//     navigate('/lotteries');
//   }

//   if (loading) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 text-gray-500 dark:text-gray-400 sm:px-6 lg:px-8">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!lottery) return null;

//   const canManage = user && CAN_MANAGE.includes(user.role);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             {lottery.name}
//           </h2>
//           {lottery.description && (
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {lottery.description}
//             </p>
//           )}
//         </div>
//         <div>
//           <StatusPill status={lottery.status} />
//         </div>
//       </div>

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//             {t('lottery.ticketPrice')}
//           </div>
//           <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//             {lottery.ticketPrice}
//           </div>
//         </div>

//         {lottery.spinAtEt && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.spinAt')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {lottery.spinAtEt}
//             </div>
//           </div>
//         )}

//         {dashboard?.ticketsSold !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.ticketsSold')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.ticketsSold}
//             </div>
//           </div>
//         )}

//         {dashboard?.myTickets !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.myTickets')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.myTickets}
//             </div>
//           </div>
//         )}

//         {dashboard?.myOdds !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.myOdds')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.myOdds}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Countdown Card */}
//       {lottery.spinAt && lottery.status === 'active' && (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="mb-2 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
//             {t('lottery.countdownTo')}
//           </div>
//           <Countdown target={lottery.spinAt} />
//           {closingSoon && (
//             <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//               {t('lottery.closingSoon', {
//                 defaultValue: `Sales close automatically ${AUTO_LOCK_MINUTES} minutes before the spin.`,
//                 minutes: AUTO_LOCK_MINUTES,
//               })}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Prizes Table */}
//       {lottery.prizes?.length > 0 && (
//         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//               {t('lottery.prizes')}
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
//                 <tr>
//                   <th className="px-6 py-3">{t('lottery.prizeTier')}</th>
//                   <th className="px-6 py-3">{t('lottery.prizeName')}</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
//                 {lottery.prizes.map((p) => (
//                   <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
//                     <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
//                       {p.rank_position}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                       {p.prize_amount} Birr{p.label ? ` (${p.label})` : ''}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Purchase Section */}
//       {user && lottery.status === 'active' && (
//         <PaymentForm lottery={lottery} onSubmitted={load} closingSoon={closingSoon} />
//       )}

//       {/* User Tickets Section */}
//       {user && tickets.length > 0 && (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//             {t('lottery.myTickets')}
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {tickets.map((tk) => (
//               <span
//                 key={tk.id}
//                 className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-500/20"
//               >
//                 {tk.ticketNumber}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Admin Panel */}
//       {canManage && (
//         <ManagePanel
//           lottery={lottery}
//           user={user}
//           onChanged={load}
//           onDeleted={handleDeleted}
//         />
//       )}
//     </div>
//   );
// }

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';
// import Countdown from '../../components/Countdown';

// const CAN_MANAGE = ['admin', 'lottery_manager'];
// const DELETE_ROLES = ['admin']; // only admin can delete a lottery
// const STATUS_FLOW = ['draft', 'active', 'locked', 'completed'];
// const PAYMENT_METHODS = ['telebirr', 'cbe_birr', 'bank_transfer', 'other'];

// // Roles that are allowed to see a lottery regardless of its status.
// // Everyone else (regular users, group leaders, logged-out visitors) may
// // only view lotteries that are 'active' or 'completed'.
// const ADMIN_ROLES = ['admin'];
// const USER_VISIBLE_STATUSES = ['active', 'completed'];

// // Ticket sales cut off this many minutes before the scheduled spin.
// const AUTO_LOCK_MINUTES = 2;
// const AUTO_LOCK_MS = AUTO_LOCK_MINUTES * 60 * 1000;

// function PaymentForm({ lottery, onSubmitted, closingSoon }) {
//   const { t } = useTranslation();
//   const isPackageMode = lottery.ticketMode === 'package';
//   const [packageId, setPackageId] = useState('');
//   const [amount, setAmount] = useState('');
//   const [method, setMethod] = useState(PAYMENT_METHODS[0]);
//   const [senderName, setSenderName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [transactionId, setTransactionId] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [saving, setSaving] = useState(false);

//   const previewAmount = isPackageMode
//     ? lottery.packages?.find((p) => String(p.id) === String(packageId))?.price
//     : amount;

//   const previewTickets =
//     !isPackageMode && lottery.ticketMode === 'custom' && amount && lottery.ticketPrice
//       ? Math.floor(Number(amount) / Number(lottery.ticketPrice))
//       : null;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setSaving(true);

//     try {
//       const finalAmount = isPackageMode ? previewAmount : amount;
//       const fd = new FormData();
//       fd.append('lotteryId', lottery.id);
//       fd.append('amount', finalAmount);
//       fd.append('method', method);
//       fd.append('senderName', senderName);
//       fd.append('phoneNumber', phoneNumber);
//       fd.append('transactionId', transactionId);

//       if (isPackageMode) {
//         fd.append('packageId', packageId);
//       }
//       if (screenshot) {
//         fd.append('screenshot', screenshot);
//       }

//       await api.post('/payments', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setSuccess(t('payments.submitSuccess'));
//       setPackageId('');
//       setAmount('');
//       setSenderName('');
//       setPhoneNumber('');
//       setTransactionId('');
//       setScreenshot(null);
//       onSubmitted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//       <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//         {t('payments.buyTickets')}
//       </h3>

//       {closingSoon && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {t('payments.closingSoon', {
//             defaultValue: `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
//             minutes: AUTO_LOCK_MINUTES,
//           })}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {isPackageMode ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {(lottery.packages || []).map((p) => {
//               const isSelected = String(packageId) === String(p.id);
//               return (
//                 <div
//                   key={p.id}
//                   onClick={() => setPackageId(p.id)}
//                   className={`cursor-pointer rounded-lg border p-4 transition-all ${
//                     isSelected
//                       ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30'
//                       : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
//                   }`}
//                 >
//                   <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
//                   <div className="my-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
//                     {p.price}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {p.ticketCount} {t('lottery.tickets')}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('payments.amount')}
//             </span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//             {previewTickets !== null && (
//               <small className="block text-xs text-gray-500 dark:text-gray-400">
//                 {t('payments.ticketsPreview', { count: previewTickets })}
//               </small>
//             )}
//           </label>
//         )}

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.method')}
//           </span>
//           <select
//             value={method}
//             onChange={(e) => setMethod(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           >
//             {PAYMENT_METHODS.map((m) => (
//               <option key={m} value={m}>
//                 {t(`payments.methods.${m}`)}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.senderName')}
//           </span>
//           <input
//             type="text"
//             value={senderName}
//             onChange={(e) => setSenderName(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.phoneNumber')}
//           </span>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.transactionId')}
//           </span>
//           <input
//             type="text"
//             value={transactionId}
//             onChange={(e) => setTransactionId(e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//           />
//         </label>

//         <label className="block space-y-1">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t('payments.screenshot')}
//           </span>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-950 dark:file:text-indigo-300"
//           />
//         </label>

//         {previewAmount && (
//           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             {t('payments.total')}: {previewAmount}
//           </p>
//         )}

//         <div className="flex justify-end pt-2">
//           <button
//             type="submit"
//             disabled={saving || closingSoon || (isPackageMode && !packageId)}
//             className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {saving ? t('common.saving') : t('payments.submit')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function ManagePanel({ lottery, user, onChanged, onDeleted }) {
//   const { t } = useTranslation();
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [ticketCount, setTicketCount] = useState('');
//   const [error, setError] = useState('');
//   const [busy, setBusy] = useState(false);

//   const canDelete = user && DELETE_ROLES.includes(user.role);

//   async function addPackage(e) {
//     e.preventDefault();
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/lotteries/${lottery.id}/packages`, {
//         name,
//         price: Number(price),
//         ticketCount: Number(ticketCount),
//       });
//       setName('');
//       setPrice('');
//       setTicketCount('');
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function changeStatus(status) {
//     setError('');
//     setBusy(true);
//     try {
//       await api.patch(`/lotteries/${lottery.id}/status`, { status });
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function triggerDraw() {
//     if (!window.confirm(t('lottery.confirmDraw'))) return;
//     setError('');
//     setBusy(true);
//     try {
//       await api.post(`/winners/lottery/${lottery.id}/draw`);
//       onChanged();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function deleteLottery() {
//     const confirmMsg = t('lottery.confirmDelete', {
//       defaultValue: 'Delete this lottery? This action cannot be undone.',
//     });
//     if (!window.confirm(confirmMsg)) return;

//     setError('');
//     setBusy(true);
//     try {
//       await api.delete(`/lotteries/${lottery.id}`);
//       onDeleted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//       <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//         {t('lottery.manage')}
//       </h3>
//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       <div className="mb-6 flex flex-wrap gap-2">
//         {STATUS_FLOW.map((s) => {
//           const isActiveStatus = s === lottery.status;
//           return (
//             <button
//               key={s}
//               type="button"
//               disabled={busy || isActiveStatus}
//               onClick={() => changeStatus(s)}
//               className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
//                 isActiveStatus
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//               }`}
//             >
//               {t(`status.${s}`)}
//             </button>
//           );
//         })}
//         <button
//           type="button"
//           disabled={busy}
//           onClick={triggerDraw}
//           className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {t('lottery.drawNow')}
//         </button>

//         {canDelete && (
//           <button
//             type="button"
//             disabled={busy}
//             onClick={deleteLottery}
//             className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {t('lottery.deleteLottery', { defaultValue: 'Delete Lottery' })}
//           </button>
//         )}
//       </div>

//       {lottery.ticketMode === 'package' && (
//         <form onSubmit={addPackage} className="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
//           <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
//             {t('lottery.form.addPackage')}
//           </span>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packageName')}
//             </span>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packagePrice')}
//             </span>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <label className="block space-y-1">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {t('lottery.form.packageTickets')}
//             </span>
//             <input
//               type="number"
//               min="1"
//               value={ticketCount}
//               onChange={(e) => setTicketCount(e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
//             />
//           </label>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={busy}
//               className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {t('lottery.form.save')}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

// export default function LotteryDetail() {
//   const { id } = useParams();
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [lottery, setLottery] = useState(null);
//   const [dashboard, setDashboard] = useState(null);
//   const [tickets, setTickets] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [closingSoon, setClosingSoon] = useState(false);
//   const autoLockingRef = useRef(false);

//   const load = useCallback(async () => {
//     try {
//       const requests = [api.get(`/lotteries/${id}`)];
//       if (user) {
//         requests.push(api.get(`/lotteries/${id}/dashboard`));
//         requests.push(api.get(`/tickets/lottery/${id}/mine`));
//       }
//       const results = await Promise.allSettled(requests);

//       if (results[0].status === 'fulfilled') {
//         setLottery(results[0].value.data.lottery);
//       } else {
//         setError(results[0].reason?.response?.data?.message || t('errors.generic'));
//       }
//       if (user && results[1]?.status === 'fulfilled') {
//         setDashboard(results[1].value.data);
//       }
//       if (user && results[2]?.status === 'fulfilled') {
//         setTickets(results[2].value.data.tickets || []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [id, user, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     if (!lottery?.spinAt) {
//       setClosingSoon(false);
//       return undefined;
//     }

//     const canManage = user && CAN_MANAGE.includes(user.role);
//     const spinTime = new Date(lottery.spinAt).getTime();

//     function tick() {
//       const msLeft = spinTime - Date.now();
//       const withinLockWindow = msLeft > 0 && msLeft <= AUTO_LOCK_MS;

//       setClosingSoon(lottery.status === 'active' && withinLockWindow);

//       if (
//         canManage &&
//         lottery.status === 'active' &&
//         withinLockWindow &&
//         !autoLockingRef.current
//       ) {
//         autoLockingRef.current = true;
//         api
//           .patch(`/lotteries/${id}/status`, { status: 'locked' })
//           .then(() => load())
//           .catch(() => {
//             autoLockingRef.current = false;
//           });
//       }
//     }

//     tick();
//     const intervalId = setInterval(tick, 5000);
//     return () => clearInterval(intervalId);
//   }, [lottery?.spinAt, lottery?.status, user, id, load]);

//   function handleDeleted() {
//     navigate('/lotteries');
//   }

//   if (loading) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 text-gray-500 dark:text-gray-400 sm:px-6 lg:px-8">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!lottery) return null;

//   const isAdmin = user && ADMIN_ROLES.includes(user.role);

//   // Non-admins (including logged-out visitors) may only view lotteries
//   // that are 'active' or 'completed'. Admins can view every status
//   // ('draft', 'active', 'locked', 'completed').
//   if (!isAdmin && !USER_VISIBLE_STATUSES.includes(lottery.status)) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="rounded-lg bg-yellow-50 p-4 text-sm font-medium text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300">
//           {t('lottery.notAvailable', {
//             defaultValue: 'This lottery is not currently available.',
//           })}
//         </div>
//       </div>
//     );
//   }

//   const canManage = user && CAN_MANAGE.includes(user.role);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             {lottery.name}
//           </h2>
//           {lottery.description && (
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {lottery.description}
//             </p>
//           )}
//         </div>
//         <div>
//           <StatusPill status={lottery.status} />
//         </div>
//       </div>

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//             {t('lottery.ticketPrice')}
//           </div>
//           <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//             {lottery.ticketPrice}
//           </div>
//         </div>

//         {lottery.spinAtEt && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.spinAt')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {lottery.spinAtEt}
//             </div>
//           </div>
//         )}

//         {dashboard?.ticketsSold !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.ticketsSold')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.ticketsSold}
//             </div>
//           </div>
//         )}

//         {dashboard?.myTickets !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.myTickets')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.myTickets}
//             </div>
//           </div>
//         )}

//         {dashboard?.myOdds !== undefined && (
//           <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//             <div className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
//               {t('lottery.myOdds')}
//             </div>
//             <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
//               {dashboard.myOdds}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Countdown Card */}
//       {lottery.spinAt && lottery.status === 'active' && (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="mb-2 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
//             {t('lottery.countdownTo')}
//           </div>
//           <Countdown target={lottery.spinAt} />
//           {closingSoon && (
//             <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
//               {t('lottery.closingSoon', {
//                 defaultValue: `Sales close automatically ${AUTO_LOCK_MINUTES} minutes before the spin.`,
//                 minutes: AUTO_LOCK_MINUTES,
//               })}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Prizes Table */}
//       {lottery.prizes?.length > 0 && (
//         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//               {t('lottery.prizes')}
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
//                 <tr>
//                   <th className="px-6 py-3">{t('lottery.prizeTier')}</th>
//                   <th className="px-6 py-3">{t('lottery.prizeName')}</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
//                 {lottery.prizes.map((p) => (
//                   <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
//                     <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
//                       {p.rank_position}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                       {p.prize_amount} Birr{p.label ? ` (${p.label})` : ''}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Purchase Section */}
//       {user && lottery.status === 'active' && (
//         <PaymentForm lottery={lottery} onSubmitted={load} closingSoon={closingSoon} />
//       )}

//       {/* User Tickets Section */}
//       {user && tickets.length > 0 && (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//           <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//             {t('lottery.myTickets')}
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {tickets.map((tk) => (
//               <span
//                 key={tk.id}
//                 className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-500/20"
//               >
//                 {tk.ticketNumber}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Admin Panel */}
//       {canManage && (
//         <ManagePanel
//           lottery={lottery}
//           user={user}
//           onChanged={load}
//           onDeleted={handleDeleted}
//         />
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

import StatusPill  from '../../components/StatusPill';
import Countdown   from '../../components/Countdown';
import PaymentForm from './PaymentForm';
import ManagePanel from './ManagePanel';
import MyTickets   from './MyTickets';

import {
  CAN_MANAGE, ADMIN_ROLES, USER_VISIBLE_STATUSES, AUTO_LOCK_MS, AUTO_LOCK_MINUTES,
} from './lotteryConstants';

export default function LotteryDetail() {
  const { id }       = useParams();
  const { t }        = useTranslation();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [lottery,      setLottery]      = useState(null);
  const [dashboard,    setDashboard]    = useState(null);
  const [tickets,      setTickets]      = useState([]);
  const [myPayment,    setMyPayment]    = useState(null);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(true);
  const [closingSoon,  setClosingSoon]  = useState(false);
  const autoLockingRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const requests = [api.get(`/lotteries/${id}`)];
      if (user) {
        requests.push(api.get(`/lotteries/${id}/dashboard`));
        requests.push(api.get(`/tickets/lottery/${id}/mine`));
        requests.push(api.get(`/payments/mine/lottery/${id}`)); // latest payment for this lottery
      }
      const results = await Promise.allSettled(requests);

      if (results[0].status === 'fulfilled') setLottery(results[0].value.data.lottery);
      else setError(results[0].reason?.response?.data?.message || t('errors.generic'));

      if (user) {
        if (results[1]?.status === 'fulfilled') setDashboard(results[1].value.data);
        if (results[2]?.status === 'fulfilled') setTickets(results[2].value.data.tickets || []);
        if (results[3]?.status === 'fulfilled') setMyPayment(results[3].value.data.payment || null);
      }
    } finally {
      setLoading(false);
    }
  }, [id, user, t]);

  useEffect(() => { load(); }, [load]);

  // Auto-lock countdown effect
  useEffect(() => {
    if (!lottery?.spinAt) { setClosingSoon(false); return; }
    const canManage = user && CAN_MANAGE.includes(user.role);
    const spinTime  = new Date(lottery.spinAt).getTime();

    function tick() {
      const msLeft = spinTime - Date.now();
      const within = msLeft > 0 && msLeft <= AUTO_LOCK_MS;
      setClosingSoon(lottery.status === 'active' && within);
      if (canManage && lottery.status === 'active' && within && !autoLockingRef.current) {
        autoLockingRef.current = true;
        api.patch(`/lotteries/${id}/status`, { status: 'locked' })
          .then(() => load())
          .catch(() => { autoLockingRef.current = false; });
      }
    }

    tick();
    const timer = setInterval(tick, 5000);
    return () => clearInterval(timer);
  }, [lottery?.spinAt, lottery?.status, user, id, load]);

  if (loading) return <PageMsg>{t('common.loading')}</PageMsg>;
  if (error)   return <PageMsg variant="error">{error}</PageMsg>;
  if (!lottery) return null;

  const isAdmin   = user && ADMIN_ROLES.includes(user.role);
  const canManage = user && CAN_MANAGE.includes(user.role);

  if (!isAdmin && !USER_VISIBLE_STATUSES.includes(lottery.status)) {
    return (
      <PageMsg variant="warn">
        {t('lottery.notAvailable', { defaultValue: 'This lottery is not currently available.' })}
      </PageMsg>
    );
  }

  const metrics = [
    { label: t('lottery.ticketPrice'),  value: lottery.ticketPrice,       show: true },
    { label: t('lottery.spinAt'),       value: lottery.spinAtEt,          show: !!lottery.spinAtEt },
    { label: t('lottery.ticketsSold'),  value: dashboard?.ticketsSold,    show: dashboard?.ticketsSold !== undefined },
    { label: t('lottery.myTickets'),    value: dashboard?.myTickets,      show: dashboard?.myTickets  !== undefined },
    { label: t('lottery.myOdds'),       value: dashboard?.myOdds,         show: dashboard?.myOdds     !== undefined },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{lottery.name}</h2>
          {lottery.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{lottery.description}</p>
          )}
        </div>
        <StatusPill status={lottery.status} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.filter((m) => m.show).map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} />
        ))}
      </div>

      {/* Countdown */}
      {lottery.spinAt && lottery.status === 'active' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('lottery.countdownTo')}
          </p>
          <Countdown target={lottery.spinAt} />
          {closingSoon && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300">
              {t('lottery.closingSoon', {
                defaultValue: `Sales close automatically ${AUTO_LOCK_MINUTES} minutes before the spin.`,
                minutes: AUTO_LOCK_MINUTES,
              })}
            </p>
          )}
        </div>
      )}

      {/* Prizes */}
      {lottery.prizes?.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('lottery.prizes')}</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">{t('lottery.prizeTier')}</th>
                <th className="px-6 py-3">{t('lottery.prizeName')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {lottery.prizes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.rank_position}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {p.prize_amount} Birr{p.label ? ` (${p.label})` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buy tickets */}
      {user && lottery.status === 'active' && (
        <PaymentForm lottery={lottery} onSubmitted={load} closingSoon={closingSoon} />
      )}

      {/* My tickets / pending state */}
      {user && (
        <MyTickets tickets={tickets} payment={myPayment} />
      )}

      {/* Admin panel */}
      {canManage && (
        <ManagePanel
          lottery={lottery}
          user={user}
          onChanged={load}
          onDeleted={() => navigate('/lotteries')}
        />
      )}
    </div>
  );
}

// ── Local helpers ─────────────────────────────────────────────────────────────

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function PageMsg({ variant, children }) {
  const styles = {
    error: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300',
    warn:  'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300',
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {variant ? (
        <div className={`rounded-lg p-4 text-sm font-medium ${styles[variant]}`}>{children}</div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">{children}</p>
      )}
    </div>
  );
}