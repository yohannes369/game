import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

// Status badge styles
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  approved: {
    label: 'Approved',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
  },
  rejected: {
    label: 'Rejected',
    classes: 'bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-950/40 dark:text-red-300',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    ),
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    classes: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20',
    icon: null,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.classes}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function TicketChip({ number }) {
  return (
    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-500/20 font-mono tracking-wider">
      #{number}
    </span>
  );
}

function normalizeStatus(value) {
  return String(value || '').toLowerCase();
}

function getTicketNumbers(payment) {
  const raw = payment.ticketNumbers ?? payment.tickets ?? null;

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (item === null || item === undefined || item === '') return null;
        if (typeof item === 'object') {
          return item.ticketNumber ?? item.ticket_number ?? item.number ?? item.value ?? null;
        }
        return String(item).trim();
      })
      .filter((item) => item !== null && item !== undefined && item !== '');
  }

  if (raw === null || raw === undefined) return [];

  return String(raw)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function OrderCard({ payment }) {
  const status = normalizeStatus(payment.status);
  const isApproved = status === 'approved';
  const tickets = getTicketNumbers(payment);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="min-w-0 flex-1">
          <Link
            to={`/lotteries/${payment.lotteryId}`}
            className="text-base font-bold text-gray-900 hover:text-indigo-600 transition-colors dark:text-white dark:hover:text-indigo-400 truncate block"
          >
            {payment.lotteryName || `Lottery #${payment.lotteryId}`}
          </Link>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Ordered {new Date(payment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Payment details row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-gray-400 dark:text-gray-500">Amount</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {payment.amount} Birr
            </span>
          </div>
          <div>
            <span className="text-gray-400 dark:text-gray-500">Method</span>
            <span className="ml-2 font-semibold text-gray-700 capitalize dark:text-gray-300">
              {payment.method?.replace('_', ' ')}
            </span>
          </div>
          {payment.transactionId && (
            <div>
              <span className="text-gray-400 dark:text-gray-500">TxID</span>
              <span className="ml-2 font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                {payment.transactionId}
              </span>
            </div>
          )}
        </div>

        {/* Ticket Numbers — only shown when approved */}
        {isApproved && tickets.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Your Tickets ({tickets.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tickets.map((ticketNumber, index) => (
                <TicketChip key={`${ticketNumber}-${index}`} number={ticketNumber} />
              ))}
            </div>
          </div>
        )}

        {/* Pending state explanation */}
        {status === 'pending' && (
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 px-3.5 py-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Your payment is under review. Ticket numbers will appear here once an admin approves it.
          </div>
        )}

        {/* Rejected state */}
        {status === 'rejected' && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 px-3.5 py-3 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-300">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {payment.adminNote || 'This payment was rejected. Please contact support if you believe this is an error.'}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex gap-4">
          <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-14 rounded-md bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyLotteries() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | pending | approved | rejected

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/payments/mine')
      .then((res) => setPayments(res.data.payments || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const visible = filter === 'all' ? payments : payments.filter((p) => normalizeStatus(p.status) === filter);

  const counts = {
    pending: payments.filter((p) => normalizeStatus(p.status) === 'pending').length,
    approved: payments.filter((p) => normalizeStatus(p.status) === 'approved').length,
    rejected: payments.filter((p) => normalizeStatus(p.status) === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          My Lottery Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your ticket purchases — pending approval and confirmed tickets.
        </p>
      </div>

      {/* Summary Chips */}
      {!loading && payments.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-3 text-sm">
          {counts.pending > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              {counts.pending} pending review
            </span>
          )}
          {counts.approved > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
              {counts.approved} approved
            </span>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && payments.length > 0 && (
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && counts[tab.key] > 0 && (
                <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-600">
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && visible.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {filter === 'all'
              ? 'Browse lotteries and submit a payment to get your ticket numbers.'
              : `You have no ${filter} orders right now.`}
          </p>
          {filter === 'all' && (
            <Link
              to="/lotteries"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Browse Lotteries
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          )}
        </div>
      )}

      {/* Orders List */}
      {!loading && visible.length > 0 && (
        <div className="space-y-4">
          {visible.map((payment) => (
            <OrderCard key={payment.id} payment={payment} />
          ))}
        </div>
      )}
    </div>
  );
}