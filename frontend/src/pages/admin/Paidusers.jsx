

// import { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// // Admin-only page: lists every user who has at least one approved payment,
// // with their total paid amount and ticket count.
// // Backend: GET /payments/paid-users
// //   optional query params: search, page, limit
// //   response shape: { users: [...], total, page, limit }
// export default function PaidUsers() {
//   const { t } = useTranslation();
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit] = useState(25);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const { data } = await api.get('/payments/paid-users', {
//         params: { search: search || undefined, page, limit },
//       });
//       setUsers(data.users || []);
//       setTotal(data.total ?? (data.users || []).length);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   }, [search, page, limit, t]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   function handleSearchSubmit(e) {
//     e.preventDefault();
//     setPage(1);
//     load();
//   }

//   function exportCsv() {
//     const header = ['Name', 'Username', 'Phone', 'Total Paid', 'Payments', 'Tickets', 'Last Payment'];
//     const rows = users.map((u) => [
//       u.name,
//       u.username || '',
//       u.phoneNumber || '',
//       u.totalPaid,
//       u.paymentCount,
//       u.ticketCount,
//       u.lastPaymentAt ? new Date(u.lastPaymentAt).toLocaleString() : '',
//     ]);
//     const csv = [header, ...rows]
//       .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
//       .join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'paid-users.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   const totalPages = Math.max(1, Math.ceil(total / limit));

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div>
//           <h2>{t('paidUsers.title', { defaultValue: 'Paid Users' })}</h2>
//           <p className="muted">
//             {t('paidUsers.subtitle', {
//               defaultValue: 'All users with at least one approved payment.',
//             })}
//           </p>
//         </div>
//         <button type="button" className="btn btn-ghost" onClick={exportCsv} disabled={!users.length}>
//           {t('paidUsers.export', { defaultValue: 'Export CSV' })}
//         </button>
//       </div>

//       <form onSubmit={handleSearchSubmit} className="form" style={{ marginBottom: '1rem' }}>
//         <label className="field">
//           <span>{t('paidUsers.search', { defaultValue: 'Search by name, username or phone' })}</span>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={t('paidUsers.searchPlaceholder', { defaultValue: 'e.g. Abebe or 0911...' })}
//           />
//         </label>
//         <div className="modal-actions">
//           <button type="submit" className="btn btn-primary">
//             {t('common.search', { defaultValue: 'Search' })}
//           </button>
//         </div>
//       </form>

//       {error && <div className="alert alert-error">{error}</div>}

//       <div className="card">
//         {loading ? (
//           <p className="muted">{t('common.loading')}</p>
//         ) : users.length === 0 ? (
//           <p className="muted">{t('paidUsers.empty', { defaultValue: 'No paid users found.' })}</p>
//         ) : (
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>{t('paidUsers.name', { defaultValue: 'Name' })}</th>
//                 <th>{t('paidUsers.username', { defaultValue: 'Username' })}</th>
//                 <th>{t('paidUsers.phone', { defaultValue: 'Phone' })}</th>
//                 <th>{t('paidUsers.totalPaid', { defaultValue: 'Total Paid' })}</th>
//                 <th>{t('paidUsers.payments', { defaultValue: 'Payments' })}</th>
//                 <th>{t('paidUsers.tickets', { defaultValue: 'Tickets' })}</th>
//                 <th>{t('paidUsers.lastPayment', { defaultValue: 'Last Payment' })}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u.id}>
//                   <td>{u.name}</td>
//                   <td>{u.username || '-'}</td>
//                   <td>{u.phoneNumber || '-'}</td>
//                   <td>{u.totalPaid} Birr</td>
//                   <td>{u.paymentCount}</td>
//                   <td>{u.ticketCount}</td>
//                   <td>{u.lastPaymentAt ? new Date(u.lastPaymentAt).toLocaleDateString() : '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="actions" style={{ marginTop: '1rem' }}>
//           <button
//             type="button"
//             className="btn btn-ghost btn-sm"
//             disabled={page <= 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//           >
//             {t('common.prev', { defaultValue: 'Prev' })}
//           </button>
//           <span className="muted" style={{ alignSelf: 'center' }}>
//             {page} / {totalPages}
//           </span>
//           <button
//             type="button"
//             className="btn btn-ghost btn-sm"
//             disabled={page >= totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           >
//             {t('common.next', { defaultValue: 'Next' })}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

export default function PaidUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [processingId, setProcessingId] = useState(null);
  const [success, setSuccess] = useState('');

  // ------------------------------------------------------------
  // Load paid users
  // ------------------------------------------------------------

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/payments/paid-users', {
        params: {
          search: search || undefined,
          page,
          limit,
        },
      });

      setUsers(data.users || []);
      setTotal(data.total ?? (data.users || []).length);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t('errors.generic', {
            defaultValue: 'Something went wrong.',
          })
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, t]);

  useEffect(() => {
    load();
  }, [load]);

  // ------------------------------------------------------------
  // Search
  // ------------------------------------------------------------

  function handleSearchSubmit(e) {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
    } else {
      load();
    }
  }

  // ------------------------------------------------------------
  // Admin payout
  // ------------------------------------------------------------

  async function handlePayout(user) {
    const challengeId = user.challengeId || user.challenge_id;

    if (!challengeId) {
      setError(
        'Challenge ID is missing for this user. The paid-users API must return challengeId.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark the payout as paid for ${
        user.name || user.username || 'this user'
      }?`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(user.id);
    setError('');
    setSuccess('');

    try {
      // Using FormData to send the request
      const formData = new FormData();
      formData.append('approved', 'true');

      // PATCH request to the payout endpoint
      await api.patch(`/challenges/${challengeId}/payout`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(
        `Payout successfully processed for ${
          user.name || user.username || 'user'
        }.`
      );

      // Reload the users list after successful payout
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to process the payout.'
      );
    } finally {
      setProcessingId(null);
    }
  }

  // ------------------------------------------------------------
  // Export CSV
  // ------------------------------------------------------------

  function exportCsv() {
    const header = [
      'Name',
      'Username',
      'Phone',
      'Total Paid',
      'Payments',
      'Tickets',
      'Last Payment',
    ];

    const rows = users.map((u) => [
      u.name,
      u.username || '',
      u.phoneNumber || '',
      u.totalPaid,
      u.paymentCount,
      u.ticketCount,
      u.lastPaymentAt
        ? new Date(u.lastPaymentAt).toLocaleString()
        : '',
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replace(/"/g, '""')}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'paid-users.csv';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('paidUsers.title', {
              defaultValue: 'Paid Users',
            })}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('paidUsers.subtitle', {
              defaultValue:
                'All users with at least one approved payment.',
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          disabled={users.length === 0}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('paidUsers.export', {
            defaultValue: 'Export CSV',
          })}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('paidUsers.search', {
                defaultValue: 'Search by name, username or phone',
              })}
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('paidUsers.searchPlaceholder', {
                defaultValue: 'e.g. Abebe or 0911...',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {t('common.search', {
                defaultValue: 'Search',
              })}
            </button>
          </div>
        </div>
      </form>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-sm text-gray-500">
              {t('common.loading', {
                defaultValue: 'Loading...',
              })}
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              {t('paidUsers.empty', {
                defaultValue: 'No paid users found.',
              })}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.name', { defaultValue: 'Name' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.username', { defaultValue: 'Username' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.phone', { defaultValue: 'Phone' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.totalPaid', { defaultValue: 'Total Paid' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.payments', { defaultValue: 'Payments' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.tickets', { defaultValue: 'Tickets' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paidUsers.lastPayment', { defaultValue: 'Last Payment' })}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => {
                  const challengeId = u.challengeId || u.challenge_id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.username || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.totalPaid} Birr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.paymentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.ticketCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.lastPaymentAt
                          ? new Date(u.lastPaymentAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          disabled={processingId === u.id || !challengeId}
                          onClick={() => handlePayout(u)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {processingId === u.id ? (
                            <>
                              <svg className="animate-spin h-3 w-3 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            'Pay Winner'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('common.prev', { defaultValue: 'Prev' })}
          </button>

          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('common.next', { defaultValue: 'Next' })}
          </button>
        </div>
      )}
    </div>
  );
}