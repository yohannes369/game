
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// // ── Payment status config ─────────────────────────────────────────────────────

// const STATUS_META = {
//   pending:  { label: 'Pending',  bg: 'bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300',  dot: 'bg-amber-400'  },
//   approved: { label: 'Approved', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-400' },
//   rejected: { label: 'Rejected', bg: 'bg-red-100     text-red-800    dark:bg-red-900/40     dark:text-red-300',    dot: 'bg-red-400'    },
// };

// // Read the rejection reason regardless of what the backend calls the field.
// function getRejectionReason(order) {
//   return order.rejectionReason || order.rejection_reason || order.reason || order.rejectReason || null;
// }

// function PaymentStatusBadge({ status }) {
//   const meta = STATUS_META[status] || STATUS_META.pending;
//   return (
//     <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg}`}>
//       <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
//       {meta.label}
//     </span>
//   );
// }

// function TicketChips({ tickets }) {
//   if (!tickets?.length) return null;
//   return (
//     <div className="mt-3 flex flex-wrap gap-1.5">
//       {tickets.map((tk) => (
//         <span
//           key={tk.id}
//           className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300"
//         >
//           🎟 #{tk.ticketNumber}
//         </span>
//       ))}
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-900">
//       <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
//         <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1-1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1V6Z" />
//         </svg>
//       </div>
//       <h3 className="text-base font-semibold text-gray-900 dark:text-white">No orders yet</h3>
//       <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
//         Browse active lotteries and buy tickets — your orders will appear here.
//       </p>
//       <Link
//         to="/lotteries"
//         className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
//       >
//         Browse Lotteries
//         <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
//         </svg>
//       </Link>
//     </div>
//   );
// }

// function OrderCard({ order }) {
//   const isPending  = order.status === 'pending';
//   const isApproved = order.status === 'approved';
//   const isRejected = order.status === 'rejected';
//   const rejectionReason = getRejectionReason(order);

//   return (
//     <div className={`rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-gray-900 sm:p-6 ${
//       isApproved ? 'border-emerald-200 dark:border-emerald-900/50'
//       : isRejected ? 'border-red-200 dark:border-red-900/40'
//       : 'border-gray-200 dark:border-gray-800'
//     }`}>
//       {/* Top row */}
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <Link
//             to={`/lotteries/${order.lotteryId}`}
//             className="text-base font-bold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
//           >
//             {order.lotteryName}
//           </Link>
//           <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//             Order #{order.id} · {order.createdAtEt || order.createdAt}
//           </p>
//         </div>
//         <PaymentStatusBadge status={order.status} />
//       </div>

//       {/* Amount & method */}
//       <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
//         <div>
//           <span className="text-gray-500 dark:text-gray-400">Amount </span>
//           <span className="font-semibold text-gray-900 dark:text-white">{order.amount} Birr</span>
//         </div>
//         <div>
//           <span className="text-gray-500 dark:text-gray-400">Method </span>
//           <span className="font-semibold capitalize text-gray-900 dark:text-white">
//             {order.method?.replace('_', ' ')}
//           </span>
//         </div>
//         {order.ticketCount && (
//           <div>
//             <span className="text-gray-500 dark:text-gray-400">Tickets </span>
//             <span className="font-semibold text-gray-900 dark:text-white">{order.ticketCount}</span>
//           </div>
//         )}
//       </div>

//       {/* Ticket numbers (approved) */}
//       {isApproved && <TicketChips tickets={order.tickets} />}

//       {/* Pending hint */}
//       {isPending && (
//         <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
//           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
//           </svg>
//           Waiting for admin approval — ticket numbers will appear once confirmed.
//         </p>
//       )}

//       {/* Rejected hint — always show a message, with the reason if the admin gave one */}
//       {isRejected && (
//         <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
//           <p className="font-semibold">This payment was rejected by the admin.</p>
//           <p className="mt-1">
//             {rejectionReason
//               ? <>Reason: {rejectionReason}</>
//               : 'No reason was provided. Please contact support if you need more details.'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Page ─────────────────────────────────────────────────────────────────────

// export default function MyOrders() {
//   const { t }     = useTranslation();
//   const [orders,  setOrders]  = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState('');
//   const [filter,  setFilter]  = useState('all'); // all | pending | approved | rejected

//   useEffect(() => {
//     api
//       .get('/payments/mine')           // adjust endpoint to your API
//       .then((res) => setOrders(res.data.payments || []))
//       .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
//       .finally(() => setLoading(false));
//   }, [t]);

//   const tabs = [
//     { key: 'all',      label: 'All',      count: orders.length },
//     { key: 'pending',  label: 'Pending',  count: orders.filter((o) => o.status === 'pending').length },
//     { key: 'approved', label: 'Approved', count: orders.filter((o) => o.status === 'approved').length },
//     { key: 'rejected', label: 'Rejected', count: orders.filter((o) => o.status === 'rejected').length },
//   ];

//   const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

//   return (
//     <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
//           My Orders
//         </h1>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           Track your lottery entries and ticket numbers.
//         </p>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
//           {error}
//         </div>
//       )}

//       {/* Filter tabs */}
//       {!loading && orders.length > 0 && (
//         <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setFilter(tab.key)}
//               className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
//                 filter === tab.key
//                   ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
//                   : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
//               }`}
//             >
//               {tab.label}
//               {tab.count > 0 && (
//                 <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-600">
//                   {tab.count}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Loading skeleton */}
//       {loading && (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
//               <div className="flex justify-between">
//                 <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                 <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
//               </div>
//               <div className="mt-4 flex gap-6">
//                 <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//                 <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && orders.length === 0 && !error && <EmptyState />}

//       {/* Orders list */}
//       {!loading && visible.length > 0 && (
//         <div className="space-y-4">
//           {visible.map((order) => (
//             <OrderCard key={order.id} order={order} />
//           ))}
//         </div>
//       )}

//       {/* No results for active filter */}
//       {!loading && orders.length > 0 && visible.length === 0 && (
//         <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
//           No {filter} orders found.
//         </p>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

// ── Payment status config ─────────────────────────────────────────────────────

const STATUS_META = {
  pending:  { label: 'Pending',  bg: 'bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300',  dot: 'bg-amber-400'  },
  approved: { label: 'Approved', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', bg: 'bg-red-100     text-red-800    dark:bg-red-900/40     dark:text-red-300',    dot: 'bg-red-400'    },
};

// Read the rejection reason regardless of what the backend calls the field.
function getRejectionReason(order) {
  return order.rejectionReason || order.rejection_reason || order.reason || order.rejectReason || null;
}

function normalizeStatus(value) {
  return String(value || '').toLowerCase();
}

// Read a single ticket's number regardless of what the backend calls the field.
function getTicketNumber(tk) {
  if (tk === null || tk === undefined || tk === '') return null;
  if (typeof tk === 'object') {
    return tk.ticketNumber ?? tk.ticket_number ?? tk.number ?? tk.value ?? null;
  }
  return String(tk).trim();
}

// Normalize ticket numbers into an array of strings, no matter how the
// backend shaped the response (an array of ticket objects, an array of
// plain numbers, a ticketNumbers array, or a single number/string directly on the order).
function getTicketNumbers(order) {
  const raw = order.ticketNumbers ?? order.tickets ?? order.ticketNumber ?? order.ticket_number ?? order.lotteryNumber ?? order.lottery_number ?? order.number ?? null;

  if (Array.isArray(raw)) {
    return raw.map((item) => getTicketNumber(item)).filter((n) => n !== null && n !== undefined && n !== '');
  }

  if (raw === null || raw === undefined) return [];

  return String(raw)
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);
}

function PaymentStatusBadge({ status }) {
  const meta = STATUS_META[normalizeStatus(status)] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function TicketChips({ numbers }) {
  if (!numbers?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {numbers.map((num) => (
        <span
          key={num}
          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300"
        >
          🎟 #{num}
        </span>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1-1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1V6Z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">No orders yet</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
        Browse active lotteries and buy tickets — your orders will appear here.
      </p>
      <Link
        to="/lotteries"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Browse Lotteries
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

function OrderCard({ order }) {
  const status = normalizeStatus(order.status);
  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  const rejectionReason = getRejectionReason(order);
  const ticketNumbers = getTicketNumbers(order);

  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-gray-900 sm:p-6 ${
      isApproved ? 'border-emerald-200 dark:border-emerald-900/50'
      : isRejected ? 'border-red-200 dark:border-red-900/40'
      : 'border-gray-200 dark:border-gray-800'
    }`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/lotteries/${order.lotteryId}`}
            className="text-base font-bold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
          >
            {order.lotteryName}
          </Link>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Order #{order.id} · {order.createdAtEt || order.createdAt}
          </p>
        </div>
        <PaymentStatusBadge status={status} />
      </div>

      {/* Amount & method */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Amount </span>
          <span className="font-semibold text-gray-900 dark:text-white">{order.amount} Birr</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Method </span>
          <span className="font-semibold capitalize text-gray-900 dark:text-white">
            {order.method?.replace('_', ' ')}
          </span>
        </div>
        {order.ticketCount && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Tickets </span>
            <span className="font-semibold text-gray-900 dark:text-white">{order.ticketCount}</span>
          </div>
        )}
      </div>

      {/* Ticket / lottery number(s) — shown prominently once approved */}
      {isApproved && ticketNumbers.length > 0 && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Your ticket number{ticketNumbers.length > 1 ? 's' : ''}
          </p>
          <TicketChips numbers={ticketNumbers} />
        </div>
      )}

      {/* Pending hint */}
      {isPending && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
          </svg>
          Waiting for admin approval — ticket numbers will appear once confirmed.
        </p>
      )}

      {/* Approved but no number yet (backend hasn't attached one) */}
      {isApproved && ticketNumbers.length === 0 && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Approved — your ticket number will appear here shortly.
        </p>
      )}

      {/* Rejected hint — always show a message, with the reason if the admin gave one */}
      {isRejected && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
          <p className="font-semibold">This payment was rejected by the admin.</p>
          <p className="mt-1">
            {rejectionReason
              ? <>Reason: {rejectionReason}</>
              : 'No reason was provided. Please contact support if you need more details.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyOrders() {
  const { t }     = useTranslation();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('all'); // all | pending | approved | rejected

  useEffect(() => {
    api
      .get('/payments/mine')           // adjust endpoint to your API
      .then((res) => setOrders(res.data.payments || []))
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  }, [t]);

  const tabs = [
    { key: 'all',      label: 'All',      count: orders.length },
    { key: 'pending',  label: 'Pending',  count: orders.filter((o) => normalizeStatus(o.status) === 'pending').length },
    { key: 'approved', label: 'Approved', count: orders.filter((o) => normalizeStatus(o.status) === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: orders.filter((o) => normalizeStatus(o.status) === 'rejected').length },
  ];

  const visible = filter === 'all' ? orders : orders.filter((o) => normalizeStatus(o.status) === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your lottery entries and ticket numbers.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && orders.length > 0 && (
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex justify-between">
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-4 flex gap-6">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && !error && <EmptyState />}

      {/* Orders list */}
      {!loading && visible.length > 0 && (
        <div className="space-y-4">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* No results for active filter */}
      {!loading && orders.length > 0 && visible.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No {filter} orders found.
        </p>
      )}
    </div>
  );
}