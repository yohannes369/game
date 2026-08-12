// import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// export default function PaidUsers() {
//   const { t } = useTranslation();

//   // ============================================================
//   // STATE
//   // ============================================================

//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit] = useState(25);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [processingId, setProcessingId] = useState(null);
//   const [success, setSuccess] = useState('');

//   // ============================================================
//   // LOAD PAID USERS
//   // ============================================================

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.get('/payments/paid-users', {
//         params: {
//           search: search.trim() || undefined,
//           page,
//           limit,
//         },
//       });

//       const data = response.data || {};

//       setUsers(Array.isArray(data.users) ? data.users : []);

//       setTotal(
//         data.total ??
//           (Array.isArray(data.users) ? data.users.length : 0)
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           t(
//             'errors.generic',
//             'Something went wrong.'
//           )
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [search, page, limit, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   // ============================================================
//   // SEARCH
//   // ============================================================

//   function handleSearchSubmit(event) {
//     event.preventDefault();

//     setSuccess('');
//     setError('');

//     if (page !== 1) {
//       setPage(1);
//     } else {
//       load();
//     }
//   }

//   // ============================================================
//   // ADMIN PAYOUT
//   // ============================================================

//   async function handlePayout(user) {
//     const challengeId =
//       user.challengeId ||
//       user.challenge_id;

//     if (!challengeId) {
//       setError(
//         'Challenge ID is missing for this user. The paid-users API must return challengeId.'
//       );
//       return;
//     }

//     const userName =
//       user.name ||
//       user.username ||
//       'this user';

//     const confirmed = window.confirm(
//       `Mark payout as paid for ${userName}?`
//     );

//     if (!confirmed) {
//       return;
//     }

//     setProcessingId(user.id);
//     setError('');
//     setSuccess('');

//     try {
//       const formData = new FormData();

//       formData.append('approved', 'true');

//       await api.patch(
//         `/challenges/${challengeId}/payout`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setSuccess(
//         `Payout processed for ${userName}.`
//       );

//       await load();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           'Failed to process the payout.'
//       );
//     } finally {
//       setProcessingId(null);
//     }
//   }

//   // ============================================================
//   // EXPORT CSV
//   // ============================================================

//   function exportCsv() {
//     if (users.length === 0) {
//       return;
//     }

//     const header = [
//       'Name',
//       'Username',
//       'Phone',
//       'Total Paid',
//       'Payments',
//       'Tickets',
//       'Last Payment',
//     ];

//     const rows = users.map((user) => [
//       user.name || '',
//       user.username || '',
//       user.phoneNumber || '',
//       user.totalPaid ?? 0,
//       user.paymentCount ?? 0,
//       user.ticketCount ?? 0,
//       user.lastPaymentAt
//         ? new Date(user.lastPaymentAt).toLocaleString()
//         : '',
//     ]);

//     const csv = [header, ...rows]
//       .map((row) =>
//         row
//           .map(
//             (cell) =>
//               `"${String(cell).replace(/"/g, '""')}"`
//           )
//           .join(',')
//       )
//       .join('\n');

//     const blob = new Blob(
//       [csv],
//       {
//         type: 'text/csv;charset=utf-8;',
//       }
//     );

//     const url = URL.createObjectURL(blob);

//     const anchor = document.createElement('a');

//     anchor.href = url;
//     anchor.download = 'paid-users.csv';

//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);

//     URL.revokeObjectURL(url);
//   }

//   // ============================================================
//   // PAGINATION
//   // ============================================================

//   const totalPages = Math.max(
//     1,
//     Math.ceil(total / limit)
//   );

//   // ============================================================
//   // RENDER
//   // ============================================================

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* ========================================================
//           HEADER
//       ======================================================== */}

//       <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {t(
//               'paidUsers.title',
//               'Paid Users'
//             )}
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             {t(
//               'paidUsers.subtitle',
//               'All users with at least one approved payment.'
//             )}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={exportCsv}
//           disabled={users.length === 0}
//           className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <svg
//             className="mr-2 h-4 w-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>

//           {t(
//             'paidUsers.export',
//             'Export CSV'
//           )}
//         </button>
//       </div>

//       {/* ========================================================
//           SEARCH
//       ======================================================== */}

//       <form
//         onSubmit={handleSearchSubmit}
//         className="mb-6"
//       >
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <div className="flex-1">
//             <label
//               htmlFor="paid-users-search"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               {t(
//                 'paidUsers.search',
//                 'Search by name, username or phone'
//               )}
//             </label>

//             <input
//               id="paid-users-search"
//               type="text"
//               value={search}
//               onChange={(event) => {
//                 setSearch(event.target.value);
//                 setError('');
//                 setSuccess('');
//               }}
//               placeholder={t(
//                 'paidUsers.searchPlaceholder',
//                 'e.g. Abebe or 0911…'
//               )}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               type="submit"
//               className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               {t(
//                 'common.search',
//                 'Search'
//               )}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* ========================================================
//           SUCCESS MESSAGE
//       ======================================================== */}

//       {success && (
//         <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
//           <svg
//             className="h-5 w-5 shrink-0 text-green-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>

//           <p className="text-sm text-green-700">
//             {success}
//           </p>
//         </div>
//       )}

//       {/* ========================================================
//           ERROR MESSAGE
//       ======================================================== */}

//       {error && (
//         <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
//           <svg
//             className="h-5 w-5 shrink-0 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>

//           <p className="text-sm text-red-700">
//             {error}
//           </p>
//         </div>
//       )}

//       {/* ========================================================
//           TABLE
//       ======================================================== */}

//       <div className="rounded-lg bg-white shadow">
//         {loading ? (
//           <div className="flex items-center justify-center p-12">
//             <svg
//               className="h-8 w-8 animate-spin text-blue-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />

//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>

//             <p className="ml-3 text-sm text-gray-500">
//               {t(
//                 'common.loading',
//                 'Loading…'
//               )}
//             </p>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="p-12 text-center">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-300"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>

//             <p className="mt-2 text-sm text-gray-400">
//               {t(
//                 'paidUsers.empty',
//                 'No paid users found.'
//               )}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.name',
//                       'Name'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.username',
//                       'Username'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.phone',
//                       'Phone'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.totalPaid',
//                       'Total Paid'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.payments',
//                       'Payments'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.tickets',
//                       'Tickets'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.lastPayment',
//                       'Last Payment'
//                     )}
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     {t(
//                       'paidUsers.action',
//                       'Action'
//                     )}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {users.map((user) => {
//                   const challengeId =
//                     user.challengeId ||
//                     user.challenge_id;

//                   const isProcessing =
//                     processingId === user.id;

//                   return (
//                     <tr
//                       key={user.id}
//                       className="transition-colors hover:bg-gray-50"
//                     >
//                       {/* Name */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
//                         {user.name || '—'}
//                       </td>

//                       {/* Username */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
//                         {user.username || '—'}
//                       </td>

//                       {/* Phone */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
//                         {user.phoneNumber || '—'}
//                       </td>

//                       {/* Total Paid */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
//                         {user.totalPaid ?? 0} Birr
//                       </td>

//                       {/* Payments */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
//                         {user.paymentCount ?? 0}
//                       </td>

//                       {/* Tickets */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
//                         {user.ticketCount ?? 0}
//                       </td>

//                       {/* Last Payment */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
//                         {user.lastPaymentAt
//                           ? new Date(
//                               user.lastPaymentAt
//                             ).toLocaleDateString()
//                           : '—'}
//                       </td>

//                       {/* Action */}
//                       <td className="whitespace-nowrap px-6 py-4 text-sm">
//                         <button
//                           type="button"
//                           disabled={
//                             isProcessing ||
//                             !challengeId
//                           }
//                           onClick={() =>
//                             handlePayout(user)
//                           }
//                           className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                           title={
//                             !challengeId
//                               ? 'Challenge ID is missing'
//                               : 'Pay winner'
//                           }
//                         >
//                           {isProcessing ? (
//                             <>
//                               <svg
//                                 className="mr-1.5 h-3 w-3 animate-spin"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 />

//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 />
//                               </svg>

//                               Processing…
//                             </>
//                           ) : (
//                             'Pay winner'
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ========================================================
//           PAGINATION
//       ======================================================== */}

//       {totalPages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-4">
//           <button
//             type="button"
//             disabled={page <= 1}
//             onClick={() =>
//               setPage((currentPage) =>
//                 Math.max(1, currentPage - 1)
//               )
//             }
//             className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {t(
//               'common.prev',
//               'Prev'
//             )}
//           </button>

//           <span className="text-sm text-gray-600">
//             {page} / {totalPages}
//           </span>

//           <button
//             type="button"
//             disabled={page >= totalPages}
//             onClick={() =>
//               setPage((currentPage) =>
//                 Math.min(
//                   totalPages,
//                   currentPage + 1
//                 )
//               )
//             }
//             className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {t(
//               'common.next',
//               'Next'
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }