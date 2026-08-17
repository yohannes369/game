// // ─── Shared Lottery Constants ────────────────────────────────────────────────

// export const CAN_MANAGE        = ['admin', 'lottery_manager'];
// export const DELETE_ROLES      = ['admin'];
// export const ADMIN_ROLES       = ['admin'];
// export const STATUS_FLOW       = ['draft', 'active', 'locked', 'completed'];
// export const PAYMENT_METHODS   = ['telebirr', 'cbe_birr', 'bank_transfer', 'other'];
// export const USER_VISIBLE_STATUSES = ['active', 'completed'];

// /** Ticket sales cut off this many minutes before the scheduled spin. */
// export const AUTO_LOCK_MINUTES = 2;
// export const AUTO_LOCK_MS      = AUTO_LOCK_MINUTES * 60 * 1000;
// Shared Lottery Constants

export const CAN_MANAGE = ['admin', 'lottery_manager'];
export const DELETE_ROLES = ['admin'];
export const ADMIN_ROLES = ['admin'];

export const STATUS_FLOW = [
  'draft',
  'active',
  'locked',
  'completed',
];

// IMPORTANT:
// These values MUST exactly match the MySQL payments.method ENUM.
export const PAYMENT_METHODS = [
  'telebirr',
  'cbe',
  'bank',
];

export const USER_VISIBLE_STATUSES = [
  'active',
  'completed',
];

/** Ticket sales cut off this many minutes before the scheduled spin. */
export const AUTO_LOCK_MINUTES = 2;
export const AUTO_LOCK_MS = AUTO_LOCK_MINUTES * 60 * 1000;