// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { FiBell } from 'react-icons/fi';
// import api from '../api/axios';

// export default function NotificationBell() {
//   const { t } = useTranslation();
//   const [items, setItems] = useState([]);
//   const [open, setOpen] = useState(false);
//   const boxRef = useRef(null);

//   const unreadCount = items.filter((n) => !n.isRead).length;

//   const load = useCallback(async () => {
//     try {
//       const { data } = await api.get('/notifications');
//       setItems(data.notifications || []);
//     } catch {
//       // silent — bell just stays empty if this fails
//     }
//   }, []);

//   useEffect(() => {
//     load();
//     const id = setInterval(load, 30000);
//     return () => clearInterval(id);
//   }, [load]);

//   useEffect(() => {
//     function onClickOutside(e) {
//       if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener('mousedown', onClickOutside);
//     return () => document.removeEventListener('mousedown', onClickOutside);
//   }, []);

//   async function markRead(n) {
//     if (!n.isRead) {
//       setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
//       try {
//         await api.patch(`/notifications/${n.id}/read`);
//       } catch {
//         // ignore — will resync on next poll
//       }
//     }
//   }

//   return (
//     <div className="notif-bell-wrap" ref={boxRef} style={{ position: 'relative' }}>
//       <button
//         type="button"
//         className="notif-bell"
//         onClick={() => setOpen((o) => !o)}
//         aria-label={t('notifications.title')}
//       >
//         <FiBell />
//         {unreadCount > 0 && <span className="notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
//       </button>

//       {open && (
//         <div className="notif-dropdown">
//           {items.length === 0 && (
//             <div className="empty-state">{t('notifications.empty')}</div>
//           )}
//           {items.slice(0, 8).map((n) => (
//             <div
//               key={n.id}
//               className={n.isRead ? 'notif-item' : 'notif-item unread'}
//               onClick={() => markRead(n)}
//             >
//               <div>{n.title || n.message || n.body}</div>
//               <span className="notif-time">
//                 {new Date(n.createdAt).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa' })}
//               </span>
//             </div>
//           ))}
//           <div style={{ padding: '0.6rem 0.9rem' }}>
//             <Link to="/notifications" onClick={() => setOpen(false)}>
//               {t('notifications.viewAll')}
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBell, FiCheckCircle, FiChevronRight, FiInbox } from 'react-icons/fi';
import api from '../api/axios';

export default function NotificationBell() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setItems(data.notifications || []);
    } catch {
      // silent — bell stays empty if request fails
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  // Handle outside click & ESC key to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function markRead(n) {
    if (!n.isRead) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      try {
        await api.patch(`/notifications/${n.id}/read`);
      } catch {
        // ignore — resyncs on next poll
      }
    }
  }

  async function markAllAsRead() {
    if (unreadCount === 0) return;
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
    try {
      await api.patch('/notifications/read-all');
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative inline-block text-left" ref={boxRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        className="relative flex items-center justify-center p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t('notifications.title', 'Notifications')}
      >
        <FiBell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[11px] font-bold text-white bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-in zoom-in duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-800 z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t('notifications.title', 'Notifications')}
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {unreadCount} {t('notifications.new', 'new')}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1"
              >
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>{t('notifications.markAllRead', 'Mark all read')}</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <FiInbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t('notifications.empty', 'No notifications yet')}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t('notifications.emptySub', "We'll notify you when something important arrives.")}
                </p>
              </div>
            ) : (
              items.slice(0, 8).map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n)}
                  className={`group relative flex items-start p-3.5 text-sm transition-colors cursor-pointer ${
                    n.isRead
                      ? 'bg-white hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                      : 'bg-indigo-50/40 hover:bg-indigo-50/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!n.isRead && (
                    <span className="absolute left-2.5 top-5 w-2 h-2 rounded-full bg-indigo-600" />
                  )}

                  <div className={`flex-1 min-w-0 ${!n.isRead ? 'pl-3' : ''}`}>
                    <p
                      className={`text-xs sm:text-sm leading-snug ${
                        n.isRead
                          ? 'text-slate-600 dark:text-slate-300'
                          : 'font-semibold text-slate-900 dark:text-white'
                      }`}
                    >
                      {n.title || n.message || n.body}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {new Date(n.createdAt).toLocaleString('en-GB', {
                        timeZone: 'Africa/Addis_Ababa',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center space-x-1.5 w-full py-2 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-lg hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 transition-colors"
            >
              <span>{t('notifications.viewAll', 'View all notifications')}</span>
              <FiChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}