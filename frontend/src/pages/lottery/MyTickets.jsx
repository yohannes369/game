import { useTranslation } from 'react-i18next';

/**
 * MyTickets
 * Renders the user's ticket numbers for a single lottery.
 * Shows a pending state when tickets haven't been assigned yet.
 *
 * Props:
 *  tickets  – array of ticket objects { id, ticketNumber, status? }
 *  payment  – optional payment object { status } to show pending hint
 */
export default function MyTickets({ tickets = [], payment }) {
  const { t } = useTranslation();

  const hasPendingPayment = payment?.status === 'pending';
  const hasTickets        = tickets.length > 0;

  if (!hasTickets && !hasPendingPayment) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {t('lottery.myTickets')}
      </h3>

      {/* Pending payment hint */}
      {hasPendingPayment && !hasTickets && (
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
          </svg>
          <div>
            <p className="font-semibold">{t('payments.pendingTitle', { defaultValue: 'Payment Under Review' })}</p>
            <p className="mt-0.5 text-xs leading-relaxed">
              {t('payments.pendingHint', {
                defaultValue: 'Your payment is awaiting admin approval. Your ticket number(s) will appear here once confirmed.',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Ticket chips */}
      {hasTickets && (
        <div className="flex flex-wrap gap-2">
          {tickets.map((tk) => (
            <span
              key={tk.id}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-500/20"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1V6Z" />
              </svg>
              #{tk.ticketNumber}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}