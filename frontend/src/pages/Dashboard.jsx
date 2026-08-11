


// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';

// function RoleBadge({ role }) {
//   const { t } = useTranslation();

//   const colors = {
//     admin: 'bg-red-100 text-red-700',
//     group_leader: 'bg-blue-100 text-blue-700',
//     user: 'bg-green-100 text-green-700',
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-sm font-medium ${
//         colors[role] || 'bg-gray-100 text-gray-700'
//       }`}
//     >
//       {t(`roles.${role}`)}
//     </span>
//   );
// }

// function StatusPill({ status }) {
//   const statusStyles = {
//     paid: 'bg-green-100 text-green-700 border-green-200',
//     pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//     processing: 'bg-blue-100 text-blue-700 border-blue-200',
//     failed: 'bg-red-100 text-red-700 border-red-200',
//   };

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
//       {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
//     </span>
//   );
// }

// function formatBirr(amount) {
//   return new Intl.NumberFormat('en-US').format(Number(amount) || 0);
// }

// function formatDate(dateString) {
//   if (!dateString) return '—';
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// }

// function ChallengeListWidget({ title, challenges, loading, viewAllPath }) {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6 animate-pulse">
//         <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
//         <div className="h-4 bg-gray-200 rounded w-full mb-2" />
//         <div className="h-4 bg-gray-200 rounded w-5/6" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//         {viewAllPath && (
//           <Link to={viewAllPath} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//             {t('common.viewAll', 'View All')} →
//           </Link>
//         )}
//       </div>

//       {challenges.length === 0 ? (
//         <p className="text-gray-500 text-sm">{t('dashboard.noChallenges', 'No challenges found.')}</p>
//       ) : (
//         <div className="space-y-4">
//           {challenges.slice(0, 4).map((challenge) => (
//             <Link
//               key={challenge.challengeId}
//               to={`/challenges/${challenge.challengeId}`}
//               className="block rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-white"
//             >
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">{t('challenge.id', 'Challenge ID')}</p>
//                   <p className="text-sm font-medium text-gray-900">{challenge.challengeId}</p>
//                 </div>
//                 <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                   {challenge.status}
//                 </span>
//               </div>
//               <div className="mt-3 grid gap-2 sm:grid-cols-3">
//                 <div>
//                   <p className="text-xs text-gray-500">{t('challenge.amount', 'Amount')}</p>
//                   <p className="text-sm font-semibold text-gray-900">{formatBirr(challenge.amount)} Birr</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">{t('challenge.creator', 'Creator')}</p>
//                   <p className="text-sm text-gray-900">{challenge.creatorName || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">{t('challenge.challenger', 'Challenger')}</p>
//                   <p className="text-sm text-gray-900">{challenge.challengerName || '-'}</p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function ChallengeDashboardWidget() {
//   const { t } = useTranslation();
//   const [available, setAvailable] = useState([]);
//   const [mine, setMine] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   function getAuthToken() {
//     return localStorage.getItem('accessToken');
//   }

//   useEffect(() => {
//     Promise.all([api.get('/challenges/available'), api.get('/challenges/mine')])
//       .then(([availableRes, mineRes]) => {
//         setAvailable(availableRes.data?.challenges || []);
//         setMine(mineRes.data?.challenges || []);
//       })
//       .catch((err) => {
//         console.error('Failed to load challenges:', err);
//         setAvailable([]);
//         setMine([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // Subscribe to notifications so the available challenge list refreshes
//   // when another user creates or submits payments for a challenge.
//   useEffect(() => {
//     if (!user) return undefined;
//     const token = getAuthToken();
//     if (!token) return undefined;

//     const socket = io(import.meta.env?.VITE_SOCKET_URL || import.meta.env?.VITE_API_URL || undefined, {
//       auth: { token },
//       transports: ['websocket'],
//     });

//     socket.on('notification', (n) => {
//       if (!n || !n.type) return;
//       if (n.type === 'challenge_created' || n.type === 'challenge_ready_for_review') {
//         api
//           .get('/challenges/available')
//           .then((res) => setAvailable(res.data?.challenges || []))
//           .catch((err) => console.error('Failed to refresh available challenges:', err));
//       }
//     });

//     return () => socket.disconnect();
//   }, [user]);

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
//       <ChallengeListWidget
//         title={t('dashboard.openChallenges', 'Open Challenges')}
//         challenges={available}
//         loading={loading}
//         viewAllPath="/challenges/new"
//       />
//       <ChallengeListWidget
//         title={t('dashboard.myChallenges', 'My Challenges')}
//         challenges={mine}
//         loading={loading}
//         viewAllPath="/challenges/new"
//       />
//     </div>
//   );
// }

// function RecentWinnersWidget() {
//   const { t } = useTranslation();
//   const [winners, setWinners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get('/winners/public')
//       .then((res) => setWinners(res.data?.winners?.slice(0, 5) || []))
//       .catch((err) => {
//         console.error('Failed to load recent winners:', err);
//         setWinners([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="animate-pulse space-y-3">
//           <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//           <div className="h-4 bg-gray-200 rounded w-full"></div>
//           <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">
//           🎉 {t('dashboard.recentWinners', 'Recent Winners')}
//         </h3>
//         <Link
//           to="/winners"
//           className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//         >
//           {t('common.viewAll', 'View All')} →
//         </Link>
//       </div>

//       {winners.length === 0 ? (
//         <p className="text-gray-500 text-sm">{t('winners.empty', 'No winners yet')}</p>
//       ) : (
//         <div className="space-y-3">
//           {winners.map((winner, idx) => (
//             <div
//               key={`${winner.ticketNumber}-${idx}`}
//               className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100"
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold text-gray-800">
//                     {winner.winnerName || t('winners.anonymous')}
//                   </span>
//                   {winner.paymentCompleted && (
//                     <StatusPill status="paid" />
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-600 mt-1">
//                   {winner.lotteryName}
//                   <span className="mx-2">•</span>
//                   <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">
//                     Ticket #{winner.ticketNumber}
//                   </span>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="font-bold text-green-600">
//                   {formatBirr(winner.prizeAmount)} Birr
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {formatDate(winner.announcedAt)}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PaidUsersWidget() {
//   const { t } = useTranslation();
//   const [paidUsers, setPaidUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get('/winners/mine')
//       .then((res) => {
//         const wins = res.data?.wins || [];
//         setPaidUsers(wins.filter(w => w.withdrawalStatus === 'paid' || w.paymentCompleted));
//       })
//       .catch((err) => {
//         console.error('Failed to load paid winners:', err);
//         setPaidUsers([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="animate-pulse space-y-3">
//           <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//           <div className="h-4 bg-gray-200 rounded w-full"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <h3 className="text-lg font-bold text-gray-800 mb-4">
//         💰 {t('dashboard.paidWinners', 'Paid Out Winners')}
//       </h3>

//       {paidUsers.length === 0 ? (
//         <p className="text-gray-500 text-sm">{t('dashboard.noPaidWinners', 'No paid winners yet')}</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 <th className="pb-3">{t('lottery.title', 'Lottery')}</th>
//                 <th className="pb-3">{t('lottery.ticketNumber', 'Ticket #')}</th>
//                 <th className="pb-3">{t('winners.prizeAmount', 'Prize')}</th>
//                 <th className="pb-3">{t('winners.announcedAt', 'Date')}</th>
//                 <th className="pb-3">{t('withdrawals.status', 'Status')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {paidUsers.map((win, idx) => (
//                 <tr key={`${win.ticketNumber}-${idx}`} className="hover:bg-gray-50">
//                   <td className="py-3 pr-4">
//                     <div className="font-medium text-gray-800">{win.lotteryName}</div>
//                     <div className="text-xs text-gray-500">ID: {win.lotteryId || '—'}</div>
//                   </td>
//                   <td className="py-3 pr-4">
//                     <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//                       #{win.ticketNumber}
//                     </span>
//                   </td>
//                   <td className="py-3 pr-4">
//                     <span className="font-semibold text-green-600">
//                       {formatBirr(win.prizeAmount)} Birr
//                     </span>
//                   </td>
//                   <td className="py-3 pr-4 text-sm text-gray-600">
//                     {win.announcedAtEt || formatDate(win.announcedAt)}
//                   </td>
//                   <td className="py-3">
//                     <StatusPill status={win.withdrawalStatus || 'paid'} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// function LotteryStatsWidget() {
//   const { t } = useTranslation();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     const loadLotteryStats = async () => {
//       setLoading(true);

//       try {
//         const [winnersRes, lotteriesRes] = await Promise.all([
//           api.get('/winners/public'),
//           // Use the main lotteries endpoint instead of /lotteries/active.
//           // The backend response is normalized below so both array and
//           // { lotteries: [...] } response formats are supported.
//           api.get('/lotteries'),
//         ]);

//         if (cancelled) return;

//         const winners = Array.isArray(winnersRes.data?.winners)
//           ? winnersRes.data.winners
//           : [];

//         const allLotteries = Array.isArray(lotteriesRes.data?.lotteries)
//           ? lotteriesRes.data.lotteries
//           : Array.isArray(lotteriesRes.data)
//             ? lotteriesRes.data
//             : [];

//         // Only count lotteries that are actually active.
//         // Supports common backend status values and boolean isActive.
//         const activeLotteries = allLotteries.filter((lottery) => {
//           if (lottery?.isActive === true) return true;

//           const status = String(lottery?.status || '').toLowerCase();

//           return [
//             'active',
//             'open',
//             'running',
//             'published',
//           ].includes(status);
//         });

//         const totalPrizePool = activeLotteries.reduce(
//           (sum, lottery) => {
//             const prizeAmount =
//               Number(lottery?.prizeAmount) ||
//               Number(lottery?.prize_amount) ||
//               Number(lottery?.prize) ||
//               0;

//             return sum + prizeAmount;
//           },
//           0
//         );

//         const totalWinners = winners.length;

//         const totalPaidOut = winners
//           .filter(
//             (winner) =>
//               winner?.paymentCompleted === true ||
//               String(winner?.withdrawalStatus || '').toLowerCase() === 'paid'
//           )
//           .reduce(
//             (sum, winner) =>
//               sum +
//               (Number(winner?.prizeAmount) ||
//                 Number(winner?.prize_amount) ||
//                 0),
//             0
//           );

//         setStats({
//           activeLotteries: activeLotteries.length,
//           totalPrizePool,
//           totalWinners,
//           totalPaidOut,
//         });
//       } catch (err) {
//         if (cancelled) return;

//         console.error('Failed to load lottery dashboard statistics:', err);

//         setStats({
//           activeLotteries: 0,
//           totalPrizePool: 0,
//           totalWinners: 0,
//           totalPaidOut: 0,
//         });
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     loadLotteryStats();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
//             <div className="h-8 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       label: t('dashboard.activeLotteries', 'Active Lotteries'),
//       value: stats?.activeLotteries || 0,
//       icon: '🎲',
//       color: 'from-blue-50 to-blue-100 border-blue-200',
//     },
//     {
//       label: t('dashboard.totalPrizePool', 'Total Prize Pool'),
//       value: `${formatBirr(stats?.totalPrizePool || 0)} Birr`,
//       icon: '🏆',
//       color: 'from-purple-50 to-purple-100 border-purple-200',
//     },
//     {
//       label: t('dashboard.totalWinners', 'Total Winners'),
//       value: stats?.totalWinners || 0,
//       icon: '👑',
//       color: 'from-yellow-50 to-yellow-100 border-yellow-200',
//     },
//     {
//       label: t('dashboard.totalPaidOut', 'Total Paid Out'),
//       value: `${formatBirr(stats?.totalPaidOut || 0)} Birr`,
//       icon: '💸',
//       color: 'from-green-50 to-green-100 border-green-200',
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       {statCards.map((stat, idx) => (
//         <div
//           key={idx}
//           className={`bg-gradient-to-br ${stat.color} rounded-xl shadow p-6 border`}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-2xl">{stat.icon}</span>
//           </div>
//           <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
//           <div className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function GroupLeaderPanel() {
//   const { t } = useTranslation();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get('/groups/mine')
//       .then((res) => setData(res.data))
//       .catch((err) => {
//         console.error('Failed to load group:', err);
//         setData(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6 mt-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
//         <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//         <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//       </div>
//     );
//   }

//   if (!data?.group) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6 mt-6">
//         <p className="text-gray-500">{t('dashboard.noGroup')}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6 mt-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">{data.group.name}</h3>
//           {data.group.description && (
//             <p className="text-gray-500 mt-1">{data.group.description}</p>
//           )}
//         </div>
//         <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
//           {data.members.length} {t('groups.members', 'Members')}
//         </span>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50 text-left">
//               <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 {t('users.table.username')}
//               </th>
//               <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 {t('users.table.fullName')}
//               </th>
//               <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 {t('users.table.status')}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {data.members.map((m) => (
//               <tr key={m.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="p-3">
//                   <div className="font-medium text-gray-800">{m.username}</div>
//                 </td>
//                 <td className="p-3 text-gray-600">{m.fullName}</td>
//                 <td className="p-3">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       m.isActive
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}
//                   >
//                     {m.isActive ? t('users.active') : t('users.inactive')}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//             {data.members.length === 0 && (
//               <tr>
//                 <td colSpan="3" className="p-4 text-center text-gray-500">
//                   {t('groups.noMembers')}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const { user } = useAuth();
//   const { t } = useTranslation();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {t('dashboard.welcome', { name: user.fullName })}
//               </h1>
//               <p className="mt-1 text-gray-600 flex items-center gap-2">
//                 {t('dashboard.yourRole')}:
//                 <RoleBadge role={user.role} />
//               </p>
//             </div>
//             <Link
//               to="/change-password"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
//             >
//               {t('nav.changePassword', 'Change Password')}
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Stats Widget */}
//         <LotteryStatsWidget />

//         {/* Challenge widgets */}
//         <ChallengeDashboardWidget />

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Recent Winners */}
//           <RecentWinnersWidget />

//           {/* Paid Users */}
//           <PaidUsersWidget />
//         </div>

//         {/* Admin Section */}
//         {user.role === 'admin' && (
//           <div className="mb-6">
//             <p className="text-gray-600 mb-4">{t('dashboard.adminSummary')}</p>
//             <div className="grid md:grid-cols-2 gap-5">
//               <Link
//                 to="/users"
//                 className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
//               >
//                 <div className="text-2xl mb-2">👥</div>
//                 <h3 className="text-lg font-semibold text-gray-800">{t('nav.users')}</h3>
//                 <p className="text-sm text-gray-500 mt-1">{t('dashboard.manageUsers', 'Manage user accounts')}</p>
//               </Link>
//               <Link
//                 to="/groups"
//                 className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
//               >
//                 <div className="text-2xl mb-2">🏘️</div>
//                 <h3 className="text-lg font-semibold text-gray-800">{t('nav.groups')}</h3>
//                 <p className="text-sm text-gray-500 mt-1">{t('dashboard.manageGroups', 'Manage lottery groups')}</p>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Group Leader Section */}
//         {user.role === 'group_leader' && (
//           <>
//             <p className="text-gray-600 mb-4">{t('dashboard.leaderSummary')}</p>
//             <GroupLeaderPanel />
//           </>
//         )}

//         {/* User Section */}
//         {user.role === 'user' && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <p className="text-gray-600">{t('dashboard.userSummary')}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function RoleBadge({ role }) {
  const { t } = useTranslation();

  const colors = {
    admin: 'bg-red-100 text-red-700',
    group_leader: 'bg-blue-100 text-blue-700',
    user: 'bg-green-100 text-green-700',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[role] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {t(`roles.${role}`)}
    </span>
  );
}

function StatusPill({ status }) {
  const statusStyles = {
    paid: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </span>
  );
}

function formatBirr(amount) {
  return new Intl.NumberFormat('en-US').format(Number(amount) || 0);
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ChallengeListWidget({ title, challenges, loading, viewAllPath }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {viewAllPath && (
          <Link to={viewAllPath} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            {t('common.viewAll', 'View All')} →
          </Link>
        )}
      </div>

      {challenges.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('dashboard.noChallenges', 'No challenges found.')}</p>
      ) : (
        <div className="space-y-4">
          {challenges.slice(0, 4).map((challenge) => (
            <Link
              key={challenge.challengeId}
              to={`/challenges/${challenge.challengeId}`}
              className="block rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('challenge.id', 'Challenge ID')}</p>
                  <p className="text-sm font-medium text-gray-900">{challenge.challengeId}</p>
                </div>
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {challenge.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">{t('challenge.amount', 'Amount')}</p>
                  <p className="text-sm font-semibold text-gray-900">{formatBirr(challenge.amount)} Birr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('challenge.creator', 'Creator')}</p>
                  <p className="text-sm text-gray-900">{challenge.creatorName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('challenge.challenger', 'Challenger')}</p>
                  <p className="text-sm text-gray-900">{challenge.challengerName || '-'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengeDashboardWidget() {
  const { t } = useTranslation();
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  function getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  useEffect(() => {
    Promise.all([api.get('/challenges/available'), api.get('/challenges/mine')])
      .then(([availableRes, mineRes]) => {
        setAvailable(availableRes.data?.challenges || []);
        setMine(mineRes.data?.challenges || []);
      })
      .catch((err) => {
        console.error('Failed to load challenges:', err);
        setAvailable([]);
        setMine([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const token = getAuthToken();
    if (!token) return undefined;

    const socket = io(import.meta.env?.VITE_SOCKET_URL || import.meta.env?.VITE_API_URL || undefined, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('notification', (n) => {
      if (!n || !n.type) return;
      if (n.type === 'challenge_created' || n.type === 'challenge_ready_for_review') {
        api
          .get('/challenges/available')
          .then((res) => setAvailable(res.data?.challenges || []))
          .catch((err) => console.error('Failed to refresh available challenges:', err));
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <ChallengeListWidget
        title={t('dashboard.openChallenges', 'Open Challenges')}
        challenges={available}
        loading={loading}
        viewAllPath="/challenges/new"
      />
      <ChallengeListWidget
        title={t('dashboard.myChallenges', 'My Challenges')}
        challenges={mine}
        loading={loading}
        viewAllPath="/challenges/new"
      />
    </div>
  );
}

function RecentWinnersWidget() {
  const { t } = useTranslation();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/winners/public')
      .then((res) => setWinners(res.data?.winners?.slice(0, 5) || []))
      .catch((err) => {
        console.error('Failed to load recent winners:', err);
        setWinners([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          🎉 {t('dashboard.recentWinners', 'Recent Winners')}
        </h3>
        <Link
          to="/winners"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('common.viewAll', 'View All')} →
        </Link>
      </div>

      {winners.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('winners.empty', 'No winners yet')}</p>
      ) : (
        <div className="space-y-3">
          {winners.map((winner, idx) => (
            <div
              key={`${winner.ticketNumber}-${idx}`}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {winner.winnerName || t('winners.anonymous')}
                  </span>
                  {winner.paymentCompleted && (
                    <StatusPill status="paid" />
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {winner.lotteryName}
                  <span className="mx-2">•</span>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">
                    Ticket #{winner.ticketNumber}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  {formatBirr(winner.prizeAmount)} Birr
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(winner.announcedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaidUsersWidget() {
  const { t } = useTranslation();
  const [paidUsers, setPaidUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/winners/mine')
      .then((res) => {
        const wins = res.data?.wins || [];
        setPaidUsers(wins.filter(w => w.withdrawalStatus === 'paid' || w.paymentCompleted));
      })
      .catch((err) => {
        console.error('Failed to load paid winners:', err);
        setPaidUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        💰 {t('dashboard.paidWinners', 'Paid Out Winners')}
      </h3>

      {paidUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('dashboard.noPaidWinners', 'No paid winners yet')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="pb-3">{t('lottery.title', 'Lottery')}</th>
                <th className="pb-3">{t('lottery.ticketNumber', 'Ticket #')}</th>
                <th className="pb-3">{t('winners.prizeAmount', 'Prize')}</th>
                <th className="pb-3">{t('winners.announcedAt', 'Date')}</th>
                <th className="pb-3">{t('withdrawals.status', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paidUsers.map((win, idx) => (
                <tr key={`${win.ticketNumber}-${idx}`} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-800">{win.lotteryName}</div>
                    <div className="text-xs text-gray-500">ID: {win.lotteryId || '—'}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      #{win.ticketNumber}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-green-600">
                      {formatBirr(win.prizeAmount)} Birr
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {win.announcedAtEt || formatDate(win.announcedAt)}
                  </td>
                  <td className="py-3">
                    <StatusPill status={win.withdrawalStatus || 'paid'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LotteryStatsWidget() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadLotteryStats = async () => {
      setLoading(true);

      try {
        const [winnersRes, lotteriesRes] = await Promise.all([
          api.get('/winners/public'),
          api.get('/lotteries'),
        ]);

        if (cancelled) return;

        const winners = Array.isArray(winnersRes.data?.winners)
          ? winnersRes.data.winners
          : [];

        const allLotteries = Array.isArray(lotteriesRes.data?.lotteries)
          ? lotteriesRes.data.lotteries
          : Array.isArray(lotteriesRes.data)
            ? lotteriesRes.data
            : [];

        const activeLotteries = allLotteries.filter((lottery) => {
          if (lottery?.isActive === true) return true;

          const status = String(lottery?.status || '').toLowerCase();

          return [
            'active',
            'open',
            'running',
            'published',
          ].includes(status);
        });

        const totalPrizePool = activeLotteries.reduce(
          (sum, lottery) => {
            const prizeAmount =
              Number(lottery?.prizeAmount) ||
              Number(lottery?.prize_amount) ||
              Number(lottery?.prize) ||
              0;

            return sum + prizeAmount;
          },
          0
        );

        const totalWinners = winners.length;

        const totalPaidOut = winners
          .filter(
            (winner) =>
              winner?.paymentCompleted === true ||
              String(winner?.withdrawalStatus || '').toLowerCase() === 'paid'
          )
          .reduce(
            (sum, winner) =>
              sum +
              (Number(winner?.prizeAmount) ||
                Number(winner?.prize_amount) ||
                0),
            0
          );

        setStats({
          activeLotteries: activeLotteries.length,
          totalPrizePool,
          totalWinners,
          totalPaidOut,
        });
      } catch (err) {
        if (cancelled) return;

        console.error('Failed to load lottery dashboard statistics:', err);

        setStats({
          activeLotteries: 0,
          totalPrizePool: 0,
          totalWinners: 0,
          totalPaidOut: 0,
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLotteryStats();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: t('dashboard.activeLotteries', 'Active Lotteries'),
      value: stats?.activeLotteries || 0,
      icon: '🎲',
      color: 'from-blue-50 to-blue-100 border-blue-200',
    },
    {
      label: t('dashboard.totalPrizePool', 'Total Prize Pool'),
      value: `${formatBirr(stats?.totalPrizePool || 0)} Birr`,
      icon: '🏆',
      color: 'from-purple-50 to-purple-100 border-purple-200',
    },
    {
      label: t('dashboard.totalWinners', 'Total Winners'),
      value: stats?.totalWinners || 0,
      icon: '👑',
      color: 'from-yellow-50 to-yellow-100 border-yellow-200',
    },
    {
      label: t('dashboard.totalPaidOut', 'Total Paid Out'),
      value: `${formatBirr(stats?.totalPaidOut || 0)} Birr`,
      icon: '💸',
      color: 'from-green-50 to-green-100 border-green-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${stat.color} rounded-xl shadow p-6 border`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

function GroupLeaderPanel() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/groups/mine')
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to load group:', err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!data?.group) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <p className="text-gray-500">{t('dashboard.noGroup')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{data.group.name}</h3>
          {data.group.description && (
            <p className="text-gray-500 mt-1">{data.group.description}</p>
          )}
        </div>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
          {data.members.length} {t('groups.members', 'Members')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('users.table.username')}
              </th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('users.table.fullName')}
              </th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('users.table.status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="font-medium text-gray-800">{m.username}</div>
                </td>
                <td className="p-3 text-gray-600">{m.fullName}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      m.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {m.isActive ? t('users.active') : t('users.inactive')}
                  </span>
                </td>
              </tr>
            ))}
            {data.members.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  {t('groups.noMembers')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.welcome', { name: user?.fullName })}
              </h1>
              <p className="mt-1 text-gray-600 flex items-center gap-2">
                {t('dashboard.yourRole')}:
                <RoleBadge role={user?.role} />
              </p>
            </div>
            <Link
              to="/change-password"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {t('nav.changePassword', 'Change Password')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Widget */}
        <LotteryStatsWidget />

        {/* Challenge widgets */}
        <ChallengeDashboardWidget />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Winners */}
          <RecentWinnersWidget />

          {/* Paid Users */}
          <PaidUsersWidget />
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('dashboard.adminControl', 'Admin Control')}</h2>
            <p className="text-gray-600 mb-4">{t('dashboard.adminSummary')}</p>
            <div className="grid md:grid-cols-3 gap-5">
              <Link
                to="/users"
                className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100"
              >
                <div className="text-2xl mb-2">👥</div>
                <h3 className="text-lg font-semibold text-gray-800">{t('nav.users', 'Users')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('dashboard.manageUsers', 'Manage user accounts')}</p>
              </Link>
              <Link
                to="/groups"
                className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100"
              >
                <div className="text-2xl mb-2">🏘️</div>
                <h3 className="text-lg font-semibold text-gray-800">{t('nav.groups', 'Groups')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('dashboard.manageGroups', 'Manage lottery groups')}</p>
              </Link>
              <Link
                to="/admin/chat"
                className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100"
              >
                <div className="text-2xl mb-2">💬</div>
                <h3 className="text-lg font-semibold text-gray-800">{t('nav.adminChat', 'Support Messages')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('dashboard.manageChat', 'Manage customer support chats')}</p>
              </Link>
            </div>
          </div>
        )}

        {/* Group Leader Section */}
        {user?.role === 'group_leader' && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{t('dashboard.leaderSummary')}</p>
            <GroupLeaderPanel />
          </div>
        )}

        {/* Regular User Quick Actions */}
        {user?.role === 'user' && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('dashboard.quickActions', 'Quick Actions')}</h2>
            <p className="text-gray-600 mb-4">{t('dashboard.userSummary', 'Explore options and manage your account.')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/chat"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-medium transition"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div>{t('dashboard.supportChat', 'Support Chat')}</div>
                  <div className="text-xs text-blue-600 font-normal">Message customer support</div>
                </div>
              </Link>
              <Link
                to="/lotteries"
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg font-medium transition"
              >
                <span className="text-2xl">🎲</span>
                <div>
                  <div>{t('dashboard.browseLotteries', 'Browse Lotteries')}</div>
                  <div className="text-xs text-purple-600 font-normal">View and buy tickets</div>
                </div>
              </Link>
              <Link
                to="/challenges/new"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg font-medium transition"
              >
                <span className="text-2xl">⚔️</span>
                <div>
                  <div>{t('dashboard.createChallenge', 'Create Challenge')}</div>
                  <div className="text-xs text-green-600 font-normal">Challenge other players</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}