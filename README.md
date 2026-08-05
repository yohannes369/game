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