

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { io } from 'socket.io-client';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';

// // Same convention as NotificationBell.jsx — adjust if your token lives
// // somewhere else (AuthContext, a cookie, etc.).
// function getAuthToken() {
//   return localStorage.getItem('token');
// }

// const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || import.meta.env?.VITE_API_URL || undefined;

// function formatBirr(amount) {
//   return new Intl.NumberFormat('en-US').format(Number(amount) || 0);
// }

// function WinnerBanner({ winner, tab }) {
//   const { t } = useTranslation();
//   if (!winner) return null;

//   return (
//     <div className="card winner-banner" style={{ marginBottom: '1.25rem' }}>
//       <div className="winner-banner-icon" aria-hidden="true">🎉</div>
//       <div>
//         <div className="winner-banner-eyebrow">
//           {t('winners.latest', { defaultValue: 'Latest Winner' })}
//         </div>
//         <div className="winner-banner-title">
//           {tab === 'mine'
//             ? t('winners.youWon', { defaultValue: 'You won {{amount}} Birr!', amount: formatBirr(winner.prizeAmount) })
//             : t('winners.someoneWon', {
//                 defaultValue: '{{name}} won {{amount}} Birr!',
//                 name: winner.winnerName || t('winners.anonymous'),
//                 amount: formatBirr(winner.prizeAmount),
//               })}
//         </div>
//         <div className="winner-banner-details muted">
//           {winner.lotteryName} · {t('lottery.ticketNumber', { defaultValue: 'Ticket' })} {winner.ticketNumber}
//           {winner.announcedAtEt ? ` · ${winner.announcedAtEt}` : ''}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Winners() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [tab, setTab] = useState('public');
//   const [winners, setWinners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [toast, setToast] = useState(null);
//   const toastTimeoutRef = useRef(null);

//   const load = useCallback(async (which) => {
//     setLoading(true);
//     setError('');
//     try {
//       const url = which === 'mine' ? '/winners/mine' : '/winners/public';
//       const key = which === 'mine' ? 'wins' : 'winners';
//       const { data } = await api.get(url);
//       setWinners(data[key] || []);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [t]);

//   useEffect(() => {
//     load(tab);
//   }, [tab, load]);

//   // Live updates: when a draw completes, everyone who had a ticket gets a
//   // 'winner_announced' notification (and the winner also gets a 'winner'
//   // one) over the same socket the notification bell uses. Reuse that here
//   // to refresh the list instantly and flash a toast, instead of making
//   // people manually refresh the page to see who won.
//   useEffect(() => {
//     if (!user) return undefined;
//     const token = getAuthToken();
//     if (!token) return undefined;

//     const socket = io(SOCKET_URL, {
//       auth: { token },
//       transports: ['websocket'],
//     });

//     socket.on('notification', (notification) => {
//       if (notification.type === 'winner' || notification.type === 'winner_announced') {
//         load(tab);
//         setToast(notification.title || t('winners.newWinner', { defaultValue: 'A new winner was just announced!' }));
//         clearTimeout(toastTimeoutRef.current);
//         toastTimeoutRef.current = setTimeout(() => setToast(null), 6000);
//       }
//     });

//     return () => {
//       socket.disconnect();
//       clearTimeout(toastTimeoutRef.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, tab]);

//   const latest = winners[0] || null;

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>{t('winners.title')}</h2>
//       </div>

//       {toast && (
//         <div className="toast toast-success" role="status">
//           🎉 {toast}
//         </div>
//       )}

//       {user && (
//         <div className="tabs">
//           <button className={tab === 'public' ? 'tab active' : 'tab'} onClick={() => setTab('public')} type="button">
//             {t('winners.publicTab')}
//           </button>
//           <button className={tab === 'mine' ? 'tab active' : 'tab'} onClick={() => setTab('mine')} type="button">
//             {t('winners.mineTab')}
//           </button>
//         </div>
//       )}

//       {error && <div className="alert alert-error">{error}</div>}

//       {!loading && <WinnerBanner winner={latest} tab={tab} />}

//       {loading ? (
//         <p className="muted">{t('common.loading')}</p>
//       ) : winners.length === 0 ? (
//         <div className="card empty-state">{t('winners.empty')}</div>
//       ) : (
//         <div className="card">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>{t('lottery.title')}</th>
//                 <th>{t('lottery.ticketNumber', { defaultValue: 'Ticket' })}</th>
//                 <th>{t('winners.prizeAmount', { defaultValue: 'Prize' })}</th>
//                 <th>{t('winners.announcedAt', { defaultValue: 'Announced' })}</th>
//                 {tab === 'mine' && <th>{t('withdrawals.status')}</th>}
//                 {tab === 'public' && <th>{t('winners.winner')}</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {winners.map((w, idx) => (
//                 <tr key={`${w.ticketNumber}-${w.announcedAt}-${idx}`}>
//                   <td>{w.lotteryName}</td>
//                   <td>{w.ticketNumber}</td>
//                   <td>{formatBirr(w.prizeAmount)} Birr</td>
//                   <td>{w.announcedAtEt}</td>
//                   {tab === 'mine' && (
//                     <td>
//                       <StatusPill status={w.withdrawalStatus || 'pending'} />
//                     </td>
//                   )}
//                   {tab === 'public' && (
//                     <td>
//                       {w.winnerName || t('winners.anonymous')}
//                       {w.paymentCompleted && (
//                         <span className="badge badge-group_leader" style={{ marginLeft: '0.5rem' }}>
//                           {t('winners.paid', { defaultValue: 'Paid' })}
//                         </span>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatusPill from '../../components/StatusPill';

function getAuthToken() {
  return localStorage.getItem('token');
}

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || import.meta.env?.VITE_API_URL || undefined;

function formatBirr(amount) {
  return new Intl.NumberFormat('en-US').format(Number(amount) || 0);
}

// Helper to reliably retrieve full name across backend payload variations
function getWinnerFullName(winner, fallbackText) {
  if (!winner) return fallbackText;
  return (
    winner.winnerFullName ||
    winner.winnerName ||
    winner.fullName ||
    winner.userName ||
    (winner.user?.firstName
      ? `${winner.user.firstName} ${winner.user.lastName || ''}`.trim()
      : null) ||
    fallbackText
  );
}

function WinnerBanner({ winner, tab }) {
  const { t } = useTranslation();
  if (!winner) return null;

  const winnerDisplayName = getWinnerFullName(winner, t('winners.anonymous'));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-6 text-white shadow-lg transition-all dark:from-amber-600 dark:via-orange-600 dark:to-amber-800 sm:p-8">
      {/* Background Decorative Graphic */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-inner backdrop-blur-sm">
          🎉
        </div>
        <div className="space-y-1">
          <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-100 backdrop-blur-sm">
            {t('winners.latest', { defaultValue: 'Latest Winner' })}
          </span>
          <h3 className="text-xl font-bold sm:text-2xl">
            {tab === 'mine'
              ? t('winners.youWon', {
                  defaultValue: 'You won {{amount}} Birr!',
                  amount: formatBirr(winner.prizeAmount),
                })
              : t('winners.someoneWon', {
                  defaultValue: '{{name}} won {{amount}} Birr!',
                  name: winnerDisplayName,
                  amount: formatBirr(winner.prizeAmount),
                })}
          </h3>
          <p className="text-sm text-amber-100/90">
            {winner.lotteryName} · {t('lottery.ticketNumber', { defaultValue: 'Ticket' })} #{winner.ticketNumber}
            {winner.announcedAtEt ? ` · ${winner.announcedAtEt}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Winners() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState('public');
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const load = useCallback(async (which) => {
    setLoading(true);
    setError('');
    try {
      const url = which === 'mine' ? '/winners/mine' : '/winners/public';
      const key = which === 'mine' ? 'wins' : 'winners';
      const { data } = await api.get(url);
      setWinners(data[key] || []);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  useEffect(() => {
    if (!user) return undefined;
    const token = getAuthToken();
    if (!token) return undefined;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('notification', (notification) => {
      if (notification.type === 'winner' || notification.type === 'winner_announced') {
        load(tab);
        setToast(
          notification.title ||
            t('winners.newWinner', { defaultValue: 'A new winner was just announced!' })
        );
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setToast(null), 6000);
      }
    });

    return () => {
      socket.disconnect();
      clearTimeout(toastTimeoutRef.current);
    };
  }, [user, tab, load, t]);

  const latest = winners[0] || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
      {/* Real-time Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3.5 text-white shadow-2xl transition-all animate-bounce border border-emerald-400/30">
          <span className="text-xl">🎉</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {t('winners.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check official draw results and lucky winners.
          </p>
        </div>

        {/* Tab Controls */}
        {user && (
          <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800 self-start sm:self-auto">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === 'public'
                  ? 'bg-white text-gray-900 shadow dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
              onClick={() => setTab('public')}
              type="button"
            >
              {t('winners.publicTab')}
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === 'mine'
                  ? 'bg-white text-gray-900 shadow dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
              onClick={() => setTab('mine')}
              type="button"
            >
              {t('winners.mineTab')}
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Featured Latest Winner Banner */}
      {!loading && <WinnerBanner winner={latest} tab={tab} />}

      {/* Content States */}
      {loading ? (
        <div className="py-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </div>
      ) : winners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {t('winners.empty')}
        </div>
      ) : (
        /* Winners Data Table */
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('lottery.title')}
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('lottery.ticketNumber', { defaultValue: 'Ticket' })}
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('winners.prizeAmount', { defaultValue: 'Prize' })}
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('winners.announcedAt', { defaultValue: 'Announced' })}
                  </th>
                  {tab === 'mine' && (
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {t('withdrawals.status')}
                    </th>
                  )}
                  {tab === 'public' && (
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {t('winners.winner')}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {winners.map((w, idx) => {
                  const winnerFullName = getWinnerFullName(w, t('winners.anonymous'));

                  return (
                    <tr
                      key={`${w.ticketNumber}-${w.announcedAt}-${idx}`}
                      className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {w.lotteryName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        #{w.ticketNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">
                        {formatBirr(w.prizeAmount)} Birr
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {w.announcedAtEt || '—'}
                      </td>
                      {tab === 'mine' && (
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <StatusPill status={w.withdrawalStatus || 'pending'} />
                        </td>
                      )}
                      {tab === 'public' && (
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <span>{winnerFullName}</span>
                            {w.paymentCompleted && (
                              <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {t('winners.paid', { defaultValue: 'Paid' })}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}