# Lottery Platform — added on top of your auth backend

This adds the full Dynamic Lottery Platform to your existing auth system,
following the **exact same conventions** already in your codebase:

- `pool.query(sql, [params])` with `?` placeholders (no query builder/ORM)
- `class HttpError extends Error` from `modules/auth/auth.service.js`,
  reused everywhere (`const { HttpError } = require('../auth/auth.service')`)
- Controllers: plain `async (req, res, next) { try {...} catch(err){ next(err) } }`
- Responses: `res.json({ message, ...data })` — no wrapper envelope
- `modules/<name>/<name>.routes.js` + `.controller.js` + `.service.js`
- `authenticate` + `authorize(...roles)` middleware, unchanged
- `'admin'` is treated as the super-admin and is included in every
  admin-only route alongside the specific lottery role

Nothing in your existing `auth`, `users`, or `groups` modules was rewritten —
only `src/app.js`, `src/server.js`, `src/config/db.js`, `package.json`,
`.env.example`, and `.gitignore` were extended (see "What changed" below).

## 1. New folder structure

```
src/
├── modules/
│   ├── auth/            ← yours, untouched
│   ├── users/            ← yours, untouched
│   ├── groups/            ← yours, untouched
│   ├── lottery/            ← NEW: create/list lotteries, prizes, packages, dashboard
│   ├── ticket/            ← NEW: view your tickets for a lottery
│   ├── payment/            ← NEW: submit + admin-review manual payments
│   ├── winner/            ← NEW: the draw engine + public winner page
│   ├── withdrawal/            ← NEW: winner payout requests + admin payout
│   ├── notification/            ← NEW: in-app notifications
│   └── analytics/            ← NEW: admin dashboard totals + charts + settings
├── jobs/
│   └── lotteryScheduler.js  ← NEW: cron, auto-runs draws when spin_at passes
├── middleware/
│   └── upload.middleware.js  ← NEW: multer, for payment/withdrawal screenshots
├── utils/
│   └── random.js            ← NEW: CSPRNG shuffle used to pick winners fairly
database/
└── lottery_schema.sql       ← NEW: run after your existing schema.sql
```

## 2. Setup

```bash
npm install                     # picks up the two new deps: multer, node-cron
mysql -u <user> -p game < database/lottery_schema.sql
npm run dev
```

`lottery_schema.sql` does one thing to your existing schema — it widens
`users.role`:

```sql
ALTER TABLE users
  MODIFY role ENUM('admin','group_leader','user','lottery_manager','payment_admin','finance_admin')
  NOT NULL DEFAULT 'user';
```

Your existing `admin` / `group_leader` / `user` accounts are unaffected —
`admin` keeps full access to every lottery admin route too, since every
`authorize(...)` call in the lottery routes includes `'admin'` alongside the
specific role (e.g. `authorize('admin', 'payment_admin')`). Assign the new
roles to specific staff accounts via your existing `PUT /api/users/:id`
endpoint (`{ "role": "payment_admin" }`) whenever you want dedicated admins.

## 3. New API routes (added under `/api`, same prefix style as yours)

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/lotteries` | public | list lotteries |
| GET | `/api/lotteries/:id` | public | details incl. prizes/packages |
| GET | `/api/lotteries/:id/dashboard` | logged in | countdown, my tickets, my odds |
| POST | `/api/lotteries` | admin, lottery_manager | create a lottery |
| POST | `/api/lotteries/:id/packages` | admin, lottery_manager | add Bronze/Silver/Gold packages |
| PATCH | `/api/lotteries/:id/status` | admin, lottery_manager | draft → active → locked → completed |
| GET | `/api/tickets/lottery/:lotteryId/mine` | logged in | my tickets for a lottery |
| POST | `/api/payments` (multipart, field `screenshot`) | logged in | submit a manual payment |
| GET | `/api/payments/pending` | admin, payment_admin | review queue |
| PATCH | `/api/payments/:id/approve` | admin, payment_admin | approves + auto-generates tickets |
| PATCH | `/api/payments/:id/reject` | admin, payment_admin | rejects with a reason |
| POST | `/api/winners/lottery/:lotteryId/draw` | admin, lottery_manager | manually trigger a draw |
| GET | `/api/winners/public` | public | public winner page |
| GET | `/api/winners/mine` | logged in | my wins |
| POST | `/api/withdrawals` | logged in | request payout for a win |
| GET | `/api/withdrawals/pending` | admin, finance_admin | payout queue |
| PATCH | `/api/withdrawals/:id/pay` (multipart) | admin, finance_admin | marks as paid |
| GET | `/api/notifications` | logged in | my notifications (`?unread=true`) |
| PATCH | `/api/notifications/:id/read` | logged in | mark one read |
| GET | `/api/admin/analytics` | admin | dashboard totals + daily/monthly charts |
| GET/PUT | `/api/admin/settings/:key` | admin | referral toggle, VIP rules, etc. |

All logged-in routes use the same `Authorization: Bearer <accessToken>` your
`auth.middleware.js` already expects, from your existing `/api/auth/login`.

## 4. How the core workflows work

**Dynamic ticket calculation** (`payment.service.js: resolveTicketCount`) —
reads the lottery's `ticket_mode`: `fixed` (amount must be an exact multiple
of `ticket_price`), `package` (amount must equal a `ticket_packages` row's
price), or `custom` (`floor(amount / ticket_price)` tickets, remainder
reported back — matches your 150÷20 = 7 tickets + 10 Birr example).

**Payment approval → ticket generation** (`payment.service.js: approvePayment`)
runs inside one `withTransaction(...)` (new helper added to
`config/db.js`): locks the payment row with `FOR UPDATE`, generates the
ticket rows via `ticket.service.js`, logs a `transactions` entry, and fires
a notification — all committed together or all rolled back together.

**Automatic draw** (`jobs/lotteryScheduler.js` + `winner.service.js: runDraw`)
— a `node-cron` job checks every minute for lotteries whose `spin_at` has
passed and are still `active`, locks them, and draws one winning ticket per
prize tier using a `crypto`-backed Fisher–Yates shuffle (never
`Math.random()`), storing the random seed for auditability. Can also be
triggered manually via `POST /api/winners/lottery/:id/draw`.

**Winner payout** (`withdrawal.service.js`) — one withdrawal request per win
(`UNIQUE(winner_id)`), finance_admin uploads a transaction ID + screenshot to
mark it `paid`, which logs a `transactions` row and notifies the winner.

## 5. Security notes carried over / added

- Reuses your existing JWT `authenticate` + `authorize(...)` middleware as-is.
- `payments` has `UNIQUE (method, transaction_id)` — duplicate transaction
  IDs are rejected before they even reach the DB constraint (checked in
  `payment.service.js`, with the DB unique index as a second line of defense).
- Every money-moving operation (`approvePayment`, `runDraw`, `markPaid`) runs
  inside `withTransaction` with `SELECT ... FOR UPDATE` on the row being
  mutated, so concurrent requests can't double-process the same payment,
  draw, or payout.
- `audit_logs` and `settings` tables are included in the schema for you to
  wire up logging/feature flags as needed — not auto-populated by default,
  since your logging policy is up to you.

## 6. What changed in your existing files (and why)

- **`src/config/db.js`** — added a `withTransaction(callback)` helper
  (exported alongside the existing `pool`/`testConnection`, nothing removed)
  so approvals/draws/payouts can commit-or-rollback atomically.
- **`src/app.js`** — mounted the 7 new routers under `/api/...` and added
  static file serving for `/uploads` (payment/withdrawal screenshots). Your
  existing `auth`/`users`/`groups` mounts are untouched.
- **`src/server.js`** — starts `lotteryScheduler` after the server begins
  listening. Your existing startup/connection-check logic is untouched.
- **`package.json`** — added `multer` (file uploads) and `node-cron`
  (the draw scheduler) to `dependencies`; nothing removed or version-bumped.
- **`.env.example`** — appended `UPLOAD_DIR` and `DEFAULT_TICKET_PRICE`.
- **`.gitignore`** — added `uploads/*` (screenshots shouldn't be committed).

## 7. Still on you to wire up

- WebSocket/Socket.IO live-spin broadcast — `runDraw` returns a structured
  result object; emit it over a socket from wherever you call the
  scheduler/route once Socket.IO is added to `server.js`.
- Referral and VIP/membership reward logic — the `settings` table and
  `analytics.service.js: getSetting/setSetting` are in place as the config
  layer; the reward-granting logic itself isn't implemented yet.
- Support chat (the `messages` table is in the schema, no routes yet) —
  same pattern as `notification` module would work well here.
