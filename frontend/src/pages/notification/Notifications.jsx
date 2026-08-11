// import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// export default function Notifications() {
//   const { t } = useTranslation();
//   const [items, setItems] = useState([]);
//   const [unreadOnly, setUnreadOnly] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const { data } = await api.get('/notifications', {
//         params: unreadOnly ? { unread: true } : undefined,
//       });
//       setItems(data.notifications || []);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [unreadOnly, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function markRead(n) {
//     if (n.isRead) return;
//     setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
//     try {
//       await api.patch(`/notifications/${n.id}/read`);
//     } catch {
//       // resync silently
//       load();
//     }
//   }

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>{t('notifications.title')}</h2>
//         <label className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
//           <input
//             type="checkbox"
//             checked={unreadOnly}
//             onChange={(e) => setUnreadOnly(e.target.checked)}
//           />
//           <span>{t('notifications.unreadOnly')}</span>
//         </label>
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}

//       {loading ? (
//         <p className="muted">{t('common.loading')}</p>
//       ) : items.length === 0 ? (
//         <div className="card empty-state">{t('notifications.empty')}</div>
//       ) : (
//         <div className="card">
//           {items.map((n) => (
//             <div
//               key={n.id}
//               className={n.isRead ? 'notif-item' : 'notif-item unread'}
//               onClick={() => markRead(n)}
//               style={{ borderRadius: 'var(--radius)' }}
//             >
//               <div>
//                 <div>{n.title || n.message || n.body}</div>
//                 {n.body && n.title && <div className="muted">{n.body}</div>}
//               </div>
//               <span className="notif-time">{new Date(n.createdAt).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa' })}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiBell, 
  FiCheckCircle, 
  FiClock, 
  FiFilter, 
  FiInbox, 
  FiAlertCircle, 
  FiRefreshCw 
} from 'react-icons/fi';
import api from '../../api/axios';

export default function Notifications() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications', {
        params: unreadOnly ? { unread: true } : undefined,
      });
      setItems(data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic', 'Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(n) {
    if (n.isRead) return;
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    try {
      await api.patch(`/notifications/${n.id}/read`);
    } catch {
      // resync silently if update fails
      load();
    }
  }

  async function markAllAsRead() {
    const hasUnread = items.some((i) => !i.isRead);
    if (!hasUnread) return;

    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
    try {
      await api.patch('/notifications/read-all');
    } catch {
      load();
    }
  }

  const unreadCount = items.filter((i) => !i.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FiBell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>{t('notifications.title', 'Notifications')}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('notifications.subtitle', 'Stay updated with your latest alerts and activity')}
            </p>
          </div>

          {/* Action Bar Header */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title={t('common.refresh', 'Refresh')}
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
              >
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>{t('notifications.markAllRead', 'Mark all read')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls (Tabs Style) */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setUnreadOnly(false)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                !unreadOnly
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('notifications.all', 'All')}
            </button>
            <button
              type="button"
              onClick={() => setUnreadOnly(true)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                unreadOnly
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t('notifications.unreadOnly', 'Unread')}</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 text-xs text-slate-400 dark:text-slate-500">
            <FiFilter className="w-3.5 h-3.5" />
            <span>{t('notifications.showing', 'Filter active')}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <p className="flex-1 font-medium">{error}</p>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          /* Skeleton Loading States */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 sm:p-5 flex items-start gap-4 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
              <FiInbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('notifications.emptyTitle', 'No notifications found')}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {unreadOnly
                ? t('notifications.noUnread', 'You have catch up on all your unread notifications.')
                : t('notifications.empty', 'No notifications yet.')}
            </p>
          </div>
        ) : (
          /* Notification List Card */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n)}
                className={`group relative p-4 sm:p-5 transition-all duration-150 flex items-start justify-between gap-4 cursor-pointer ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                    : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30'
                }`}
              >
                {/* Left Indicator & Content */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="pt-1 flex-shrink-0">
                    {n.isRead ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 block group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:text-indigo-400 block ring-4 ring-indigo-100 dark:ring-indigo-900/40" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4
                      className={`text-sm leading-snug ${
                        n.isRead
                          ? 'font-medium text-slate-700 dark:text-slate-300'
                          : 'font-semibold text-slate-900 dark:text-white'
                      }`}
                    >
                      {n.title || n.message || n.body}
                    </h4>

                    {n.body && n.title && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Timestamp */}
                <div className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-0.5">
                  <FiClock className="w-3 h-3 hidden sm:inline" />
                  <span>
                    {new Date(n.createdAt).toLocaleString('en-GB', {
                      timeZone: 'Africa/Addis_Ababa',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}