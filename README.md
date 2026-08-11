# Auth System — Node.js + MySQL + React

A full authentication system prototype with three roles — **Admin**, **Group Leader**, and **User**
— and a bilingual (English / Amharic) React frontend. Login is by **username + password**
(no email), matching the requirement.

```
project/
  backend/     Express + MySQL API (JWT auth, role middleware, clean module structure)
  frontend/    React (Vite) app with i18next (en / am)
```

## What's included

- **Auth**: register (self-serve, always role `user`), login, access + refresh tokens (JWT),
  token rotation, logout (revokes refresh token), `/me`.
- **Roles**: `admin`, `group_leader`, `user`, enforced by middleware on every protected route.
- **Admin**: full CRUD on users (create/edit/delete, assign role + group, activate/deactivate)
  and groups (create/edit/delete, assign a leader, view members).
- **Group Leader**: read-only dashboard listing the members of the group they lead.
- **User**: personal dashboard showing their role/group.
- **Security basics**: bcrypt password hashing, JWT with short-lived access tokens + rotating
  refresh tokens stored server-side (revocable), login rate limiting, input validation.
- **i18n**: every UI string lives in `frontend/src/i18n/locales/{en,am}.json`; a language
  switcher is always visible (login screen included).

## 1. Prerequisites

- Node.js 18+
- MySQL 8+ (or MariaDB 10.5+) running locally or reachable over network

## 2. Database setup

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `auth_system` database with `users`, `groups`, and `refresh_tokens` tables.

## 3. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set DB_PASSWORD (and DB_USER/DB_HOST if needed), and change the two JWT secrets
npm install
npm run seed      # creates the default admin account from .env (SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD)
npm run dev        # starts the API on http://localhost:5000
```

Default seeded admin (change these in `.env` before seeding, or change the password after first login):
- username: `admin`
- password: `Admin@12345`

## 4. Frontend setup

```bash
cd frontend
npm install
npm run dev        # starts the app on http://localhost:5173
```

Open http://localhost:5173 — you'll land on the login page. Sign in as `admin` /
`Admin@12345`, or click "Register" to create a plain `user` account. Use the admin
account to create a `group_leader` and a `group`, then assign users to it.

If your API runs somewhere other than `http://localhost:5000`, set `VITE_API_URL`
in a `frontend/.env` file (e.g. `VITE_API_URL=http://localhost:5000/api`).

## 5. Trying out the three roles

1. Log in as `admin`. Go to **Users** → create a user, set their role to `group_leader`.
2. Go to **Groups** → create a group and assign that user as its leader.
3. Create a couple more plain users and assign them to the same group (edit each user → set Group).
4. Log out, log back in as the group leader account → the dashboard shows that group's members.
5. Log in as a plain user → sees only their own role/group summary.

## API overview

| Method | Route                    | Access              | Purpose                          |
|--------|---------------------------|----------------------|-----------------------------------|
| POST   | `/api/auth/register`      | public               | Self-register as `user`           |
| POST   | `/api/auth/login`         | public               | Username + password login         |
| POST   | `/api/auth/refresh`       | public (needs token) | Rotate access/refresh tokens      |
| POST   | `/api/auth/logout`        | public (needs token) | Revoke a refresh token            |
| GET    | `/api/auth/me`            | authenticated        | Current user profile              |
| GET/POST/PUT/DELETE | `/api/users`     | admin only            | Manage users                      |
| GET/POST/PUT/DELETE | `/api/groups`    | admin only            | Manage groups                     |
| GET    | `/api/groups/mine`        | group_leader only    | The caller's own group + members  |
| GET    | `/api/groups/:id/members` | admin only            | Members of a specific group       |

## What to extend first

1. **Hash refresh tokens at rest** — they're currently stored as plain strings in
   `refresh_tokens`; store a SHA-256 hash instead and compare hashes, so a DB leak doesn't
   hand out valid tokens directly.
2. **Password reset / forgot password flow** — since login has no email, this likely means
   an admin-initiated reset (admin sets a temp password) rather than an email link; the
   `PUT /api/users/:id` endpoint already supports setting a new password.
3. **Audit log** — a `login_attempts` or `activity_log` table to record logins, role changes,
   and group re-assignments; useful once more than one admin exists.
4. **Group leader write access** — currently read-only; you may want to let a leader message
   their group or mark attendance, which would need new endpoints scoped to `group_id`.
5. **Pagination & search** on `/api/users` and `/api/groups` once the tables grow past a
   couple hundred rows — right now both return everything in one query.
6. **Tests** — the service layer (`auth.service.js`, `user.service.js`, `group.service.js`) is
   already isolated from Express, so it's straightforward to unit test with a test DB or a
   mocked `pool`.
7. **HTTPS + httpOnly cookies** for tokens instead of `localStorage`, before this goes anywhere
   near production — `localStorage` is convenient for a prototype but is readable by any
   script on the page (XSS risk).


"C:\xampp\mysql\bin\mysql.exe" -u root < database\schema.sql

-- =====================================================================
-- Dynamic Lottery Platform — Schema Extension
-- Run this AFTER database/schema.sql (your existing auth schema).
-- =====================================================================

USE game;

-- ---------------------------------------------------------------------
-- Widen users.role to add the lottery-specific admin roles.
-- 'admin' keeps full super-admin access everywhere (see role checks in
-- the lottery route files, which always include 'admin' alongside the
-- specific role). Existing admin/group_leader/user accounts are
-- untouched by this change.
-- ---------------------------------------------------------------------
ALTER TABLE users
  MODIFY role ENUM('admin', 'group_leader', 'user', 'lottery_manager', 'payment_admin', 'finance_admin')
  NOT NULL DEFAULT 'user';

-- ---------------------------------------------------------------------
-- LOTTERIES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lotteries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,

  ticket_price DECIMAL(12,2) NOT NULL,          -- base price per ticket (fixed/custom modes)
  ticket_mode ENUM('fixed','package','custom') NOT NULL DEFAULT 'fixed',

  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  spin_at DATETIME NOT NULL,

  status ENUM('draft','active','locked','spinning','completed','cancelled')
    NOT NULL DEFAULT 'draft',

  random_seed VARCHAR(255) NULL,                -- stored for auditability after spin
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_lotteries_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- PRIZE TIERS (1st, 2nd, 3rd ...) per lottery
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lottery_prizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lottery_id INT NOT NULL,
  rank_position INT NOT NULL,
  prize_amount DECIMAL(14,2) NOT NULL,
  label VARCHAR(100) NULL,
  CONSTRAINT fk_prizes_lottery FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE,
  UNIQUE KEY uq_lottery_rank (lottery_id, rank_position)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- TICKET PACKAGES (Bronze/Silver/Gold style bundles)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ticket_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lottery_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  ticket_count INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_packages_lottery FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- PAYMENTS (manual payment submissions, pending admin review)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lottery_id INT NOT NULL,
  package_id INT NULL,

  amount DECIMAL(12,2) NOT NULL,
  method ENUM('cbe','telebirr','bank') NOT NULL,
  sender_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  screenshot_path VARCHAR(255) NULL,

  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  rejection_reason VARCHAR(255) NULL,
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,

  tickets_generated INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_lottery FOREIGN KEY (lottery_id) REFERENCES lotteries(id),
  CONSTRAINT fk_payments_package FOREIGN KEY (package_id) REFERENCES ticket_packages(id),
  CONSTRAINT fk_payments_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id),

  -- prevents the same transaction id being submitted twice for the same method
  UNIQUE KEY uq_payment_txn (method, transaction_id)
) ENGINE=InnoDB;

CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_user ON payments(user_id);

-- ---------------------------------------------------------------------
-- TICKETS (generated only after a payment is approved)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,    -- e.g. #000145
  lottery_id INT NOT NULL,
  user_id INT NOT NULL,
  payment_id INT NOT NULL,
  is_winner TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tickets_lottery FOREIGN KEY (lottery_id) REFERENCES lotteries(id),
  CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tickets_payment FOREIGN KEY (payment_id) REFERENCES payments(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tickets_lottery ON tickets(lottery_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);

-- ---------------------------------------------------------------------
-- WINNERS (result of the draw)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS winners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lottery_id INT NOT NULL,
  prize_id INT NOT NULL,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  prize_amount DECIMAL(14,2) NOT NULL,
  announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_winners_lottery FOREIGN KEY (lottery_id) REFERENCES lotteries(id),
  CONSTRAINT fk_winners_prize FOREIGN KEY (prize_id) REFERENCES lottery_prizes(id),
  CONSTRAINT fk_winners_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
  CONSTRAINT fk_winners_user FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uq_lottery_prize (lottery_id, prize_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- WITHDRAWALS (winner payout requests)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  winner_id INT NOT NULL,
  user_id INT NOT NULL,

  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_name VARCHAR(150) NOT NULL,

  status ENUM('waiting_payment','paid','rejected') NOT NULL DEFAULT 'waiting_payment',
  admin_transaction_id VARCHAR(100) NULL,
  payment_screenshot_path VARCHAR(255) NULL,
  processed_by INT NULL,
  processed_at DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_withdrawals_winner FOREIGN KEY (winner_id) REFERENCES winners(id),
  CONSTRAINT fk_withdrawals_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_withdrawals_admin FOREIGN KEY (processed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- TRANSACTIONS (generic financial ledger, useful for reporting)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('ticket_purchase','challenge_payment','withdrawal') NOT NULL,
  reference_id INT NOT NULL,                    -- payments.id, challenges.id or withdrawals.id
  amount DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- CHALLENGES (peer-to-peer staking contests with admin payment review)
--
-- Each challenge is created by one user, accepted by one opponent, and
-- requires both sides to submit payment references before an admin approves.
-- The draw is automatic and auditable, with immutable results recorded.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id VARCHAR(32) NOT NULL,
  creator_id INT NOT NULL,
  challenger_id INT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM(
    'WAITING','ACCEPTED','PAYMENT_PENDING','ADMIN_REVIEW','APPROVED','NUMBERS_ASSIGNED',
    'DRAW_SCHEDULED','DRAW_COMPLETED','WINNER_REQUESTED_PAYOUT','PAYOUT_REVIEW','PAID','CANCELLED'
  ) NOT NULL DEFAULT 'WAITING',
  payment_reference_creator VARCHAR(255) NULL,
  screenshot_creator VARCHAR(255) NULL,
  payment_reference_challenger VARCHAR(255) NULL,
  screenshot_challenger VARCHAR(255) NULL,
  approved_by INT NULL,
  approved_at DATETIME NULL,
  random_seed VARCHAR(255) NULL,
  winner_user_id INT NULL,
  winner_ticket_number VARCHAR(100) NULL,
  draw_at DATETIME NULL,
  payout_requested_at DATETIME NULL,
  payout_status ENUM('waiting_payment','paid','rejected') NULL,
  payout_transaction_id VARCHAR(100) NULL,
  payout_screenshot_path VARCHAR(255) NULL,
  payout_approved_by INT NULL,
  payout_approved_at DATETIME NULL,
  payout_rejection_reason VARCHAR(255) NULL,
  bank_name VARCHAR(100) NULL,
  account_number VARCHAR(50) NULL,
  account_name VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_challenges_creator FOREIGN KEY (creator_id) REFERENCES users(id),
  CONSTRAINT fk_challenges_challenger FOREIGN KEY (challenger_id) REFERENCES users(id),
  CONSTRAINT fk_challenges_approved_by FOREIGN KEY (approved_by) REFERENCES users(id),
  CONSTRAINT fk_challenges_winner FOREIGN KEY (winner_user_id) REFERENCES users(id),
  CONSTRAINT fk_challenges_payout_approved_by FOREIGN KEY (payout_approved_by) REFERENCES users(id),
  UNIQUE KEY uq_challenges_challenge_id (challenge_id),
  INDEX idx_challenges_status (status),
  INDEX idx_challenges_creator (creator_id),
  INDEX idx_challenges_challenger (challenger_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- MESSAGES (support chat between user and payment admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  body TEXT NOT NULL,
  attachment_path VARCHAR(255) NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_messages_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id),
  CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ---------------------------------------------------------------------
-- AUDIT LOGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT NULL,
  meta JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- SETTINGS (key/value system config — referral toggle, VIP rules, etc.)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
