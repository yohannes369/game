// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';

// const CAN_MANAGE = ['admin', 'lottery_manager'];

// export default function Lotteries() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [lotteries, setLotteries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     api
//       .get('/lotteries')
//       .then((res) => setLotteries(res.data.lotteries || []))
//       .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
//       .finally(() => setLoading(false));
//   }, [t]);

//   const canManage = user && CAN_MANAGE.includes(user.role);

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>{t('lottery.title')}</h2>
//         {canManage && (
//           <Link to="/lotteries/new" className="btn btn-primary">
//             {t('lottery.create')}
//           </Link>
//         )}
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}

//       {loading ? (
//         <p className="muted">{t('common.loading')}</p>
//       ) : lotteries.length === 0 ? (
//         <div className="card empty-state">{t('lottery.empty')}</div>
//       ) : (
//         <div className="quick-links">
//           {lotteries.map((l) => (
//             <Link key={l.id} to={`/lotteries/${l.id}`} className="card card-link">
//               <div className="page-header" style={{ marginBottom: '0.5rem' }}>
//                 <span>{l.name}</span>
//                 <StatusPill status={l.status} />
//               </div>
//               <p className="muted" style={{ margin: 0 }}>
//                 {t('lottery.ticketPrice')}: {l.ticketPrice}
//               </p>
//               {l.spinAtEt && (
//                 <p className="muted" style={{ margin: '0.25rem 0 0' }}>
//                   {t('lottery.spinAt')}: {l.spinAtEt}
//                 </p>
//               )}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';

// const CAN_MANAGE = ['admin', 'lottery_manager'];

// export default function Lotteries() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [lotteries, setLotteries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     api
//       .get('/lotteries')
//       .then((res) => setLotteries(res.data.lotteries || []))
//       .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
//       .finally(() => setLoading(false));
//   }, [t]);

//   const canManage = user && CAN_MANAGE.includes(user.role);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
//             {t('lottery.title')}
//           </h2>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Browse available draws or create new lottery events.
//           </p>
//         </div>
//         {canManage && (
//           <Link
//             to="/lotteries/new"
//             className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             {t('lottery.create')}
//           </Link>
//         )}
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       {/* Content States */}
//       {loading ? (
//         <div className="py-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
//           {t('common.loading')}
//         </div>
//       ) : lotteries.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
//           {t('lottery.empty')}
//         </div>
//       ) : (
//         /* Lotteries Grid */
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {lotteries.map((l) => (
//             <Link
//               key={l.id}
//               to={`/lotteries/${l.id}`}
//               className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500"
//             >
//               <div>
//                 <div className="mb-4 flex items-start justify-between gap-3">
//                   <span className="font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
//                     {l.name}
//                   </span>
//                   <StatusPill status={l.status} />
//                 </div>

//                 <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
//                   <p className="flex items-center justify-between">
//                     <span>{t('lottery.ticketPrice')}:</span>
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       {l.ticketPrice}
//                     </span>
//                   </p>

//                   {l.spinAtEt && (
//                     <p className="flex items-center justify-between pt-1">
//                       <span>{t('lottery.spinAt')}:</span>
//                       <span className="font-medium text-gray-700 dark:text-gray-300">
//                         {l.spinAtEt}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-indigo-600 dark:border-gray-800 dark:text-indigo-400">
//                 View Details &rarr;
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import StatusPill from '../../components/StatusPill';

// const CAN_MANAGE = ['admin', 'lottery_manager'];

// // Roles that may see lotteries of every status. Everyone else (regular
// // users, group leaders, logged-out visitors) only sees lotteries that are
// // 'active' or 'completed'. Keep this in sync with LotteryDetail.jsx.
// const ADMIN_ROLES = ['admin'];
// const USER_VISIBLE_STATUSES = ['active', 'completed'];

// export default function Lotteries() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [lotteries, setLotteries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     api
//       .get('/lotteries')
//       .then((res) => setLotteries(res.data.lotteries || []))
//       .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
//       .finally(() => setLoading(false));
//   }, []); // removed `t` — translation shouldn't re-trigger data fetch

//   const canManage = user && CAN_MANAGE.includes(user.role);
//   const isAdmin = user && ADMIN_ROLES.includes(user.role);

//   // Admins see every lottery regardless of status. Everyone else only
//   // sees lotteries that are currently 'active' or 'completed' — draft
//   // and locked lotteries are hidden from the list.
//   const visibleLotteries = isAdmin
//     ? lotteries
//     : lotteries.filter((l) => USER_VISIBLE_STATUSES.includes(l.status));

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div className="max-w-xl">
//           <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
//             {t('lottery.title')}
//           </h1>
//           <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
//             Browse available draws or create new lottery events.
//           </p>
//         </div>
//         {canManage && (
//           <Link
//             to="/lotteries/new"
//             className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-400"
//           >
//             <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//             </svg>
//             {t('lottery.create')}
//           </Link>
//         )}
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
//           <div className="flex items-start gap-3">
//             <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
//             </svg>
//             <span className="font-medium">{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Loading Skeleton */}
//       {loading && (
//         <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div
//               key={i}
//               className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
//             >
//               <div className="mb-4 flex items-start justify-between gap-3">
//                 <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                 <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                   <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                   <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                 </div>
//               </div>
//               <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
//                 <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && visibleLotteries.length === 0 && !error && (
//         <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900 sm:py-20">
//           <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
//             <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
//             </svg>
//           </div>
//           <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//             {t('lottery.empty')}
//           </h3>
//           <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
//             No lotteries available right now. Check back later or create one if you have permission.
//           </p>
//         </div>
//       )}

//       {/* Lotteries Grid */}
//       {!loading && visibleLotteries.length > 0 && (
//         <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {visibleLotteries.map((l) => (
//             <Link
//               key={l.id}
//               to={`/lotteries/${l.id}`}
//               className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500 sm:p-6"
//             >
//               <div>
//                 <div className="mb-4 flex items-start justify-between gap-3">
//                   <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-lg">
//                     {l.name}
//                   </h3>
//                   <StatusPill status={l.status} />
//                 </div>

//                 <dl className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between">
//                     <dt className="text-gray-500 dark:text-gray-400">{t('lottery.ticketPrice')}:</dt>
//                     <dd className="font-semibold text-gray-900 dark:text-white">{l.ticketPrice}</dd>
//                   </div>

//                   {l.spinAtEt && (
//                     <div className="flex items-center justify-between pt-1">
//                       <dt className="text-gray-500 dark:text-gray-400">{t('lottery.spinAt')}:</dt>
//                       <dd className="font-medium text-gray-700 dark:text-gray-300">{l.spinAtEt}</dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>

//               <div className="mt-5 flex items-center border-t border-gray-100 pt-4 text-xs font-semibold uppercase tracking-wide text-indigo-600 transition-colors group-hover:text-indigo-700 dark:border-gray-800 dark:text-indigo-400 dark:group-hover:text-indigo-300">
//                 View Details
//                 <svg
//                   className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2.5}
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
//                 </svg>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatusPill from '../../components/StatusPill';
import { CAN_MANAGE, ADMIN_ROLES, USER_VISIBLE_STATUSES } from './lotteryConstants';

export default function Lotteries() {
  const { t }    = useTranslation();
  const { user } = useAuth();
  const [lotteries, setLotteries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    api.get('/lotteries')
      .then((res) => setLotteries(res.data.lotteries || []))
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  }, []);

  const canManage = user && CAN_MANAGE.includes(user.role);
  const isAdmin   = user && ADMIN_ROLES.includes(user.role);
  const visible   = isAdmin ? lotteries : lotteries.filter((l) => USER_VISIBLE_STATUSES.includes(l.status));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {t('lottery.title')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Browse available draws or create new lottery events.
          </p>
        </div>
        {canManage && (
          <Link
            to="/lotteries/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('lottery.create')}
          </Link>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex justify-between gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && visible.length === 0 && !error && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('lottery.empty')}</h3>
          <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            No lotteries available right now. Check back later or create one if you have permission.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && visible.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((l) => (
            <Link
              key={l.id}
              to={`/lotteries/${l.id}`}
              className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500 sm:p-6"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-lg">
                    {l.name}
                  </h3>
                  <StatusPill status={l.status} />
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">{t('lottery.ticketPrice')}:</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white">{l.ticketPrice}</dd>
                  </div>
                  {l.spinAtEt && (
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">{t('lottery.spinAt')}:</dt>
                      <dd className="font-medium text-gray-700 dark:text-gray-300">{l.spinAtEt}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="mt-5 flex items-center border-t border-gray-100 pt-4 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:border-gray-800 dark:text-indigo-400">
                View Details
                <svg className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}