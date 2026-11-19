# EcoCollect: Full-System QA Report

**Branch:** `qa` · **Date:** 2026-11-19 · **Scope:** Backend API (Express + PostgreSQL), Admin Web (React/Vite), Mobile App (Expo: Customer + Collector)

## 1. Summary

| | Before (original `qa`) | After |
|---|---|---|
| Automated API checks passing | **7 / 91** | **96 / 96** (stable across re-runs; 5 JWT checks added) |
| DB tables with data | 2 of 10 (8 empty, silently replaced by in-memory mock) | 11 tables, fully seeded |
| Screens on hard-coded mock data | ~25 mobile screens + admin fallbacks | 0 (all read from the API) |
| Endpoints called by the UI that didn't exist | 5 | 0 |

The original backend wrapped every query in `try { … } catch {}` and fell back to an in-memory mock store. Because of that, the UI always looked like it worked, even though most tables were empty and many writes never reached Postgres. Every bug below was hidden by this pattern.

## 2. Environment

- PostgreSQL 16 (local cluster, `127.0.0.1:55432`), database **`ecocollect_qa`** (new). The original `ecocollect_pavi` database was not modified by the migration.
- `backend/.env` → `PG_DB_NAME=ecocollect_qa`
- Seed accounts (test password for all: `password123`):

| Role | Login |
|---|---|
| Admin | admin@ecocollect.lk |
| Customer | priya@gmail.com, kasun@gmail.com, amali@gmail.com, … (8 total) |
| Collector | suresh@ecocollect.lk, nuwan@ecocollect.lk, saman@ecocollect.lk, ruwan@ecocollect.lk, chaminda@ecocollect.lk (deactivated) |

Seed data: 14 users, 6 material rates, 7 rewards, 5 badges, 64 pickups across 6 months (completed / cancelled / pending / assigned / in-progress), wallets that reconcile exactly with the transaction ledger, redemptions, and notifications.

### How to run
```bash
cd backend
npm run db:setup      # drop + create schema, seed (QA DB only!)
npm run dev           # API on :4000
npm run test:api      # 96 automated checks
```

## 3. Defects found and fixed

Severity: **S1** critical (security / money), **S2** major (feature broken), **S3** minor.

### Security / data integrity
| # | Sev | Defect (original behaviour) | Fix |
|---|---|---|---|
| 1 | S1 | **No authentication.** `/auth/login` ignored the password; any unknown email logged you in as the first customer. | Passwords hashed with scrypt; 401 on bad credentials; role check; deactivated accounts blocked; JWT issued. |
| 2 | S1 | **Mobile OTP screen logged anyone in** as a mock customer. | OTP no longer grants a session (no OTP backend exists). |
| 3 | S1 | **Admin portal had no login**: the button just navigated away; every `/admin` page was open. | Real admin login + route guard + logout clears the session. |
| 4 | S1 | **Client set the redemption price**: `/wallet/redeem` deducted the `pointsRequired` sent by the client. | Price read from the DB by `rewardId`. |
| 5 | S1 | **Redeem race condition**: parallel requests could overdraw the wallet. | Transaction with `SELECT … FOR UPDATE`; test fires 10 parallel requests and exactly 4 succeed. |
| 6 | S1 | **Double completion double-credited points**: completing a job twice paid twice. | State machine: assigned → accepted → completed; repeat attempts get 409. |
| 7 | S1 | **Not user-scoped**: wallet, addresses, notifications and profile always returned the first row in the DB (every customer saw the same wallet). | All customer endpoints scoped to the caller identified by the Bearer JWT. |
| 8 | S1 | **IDOR**: any user could delete or cancel other users' addresses and pickups. | Ownership checks (404/403). |
| 9 | S2 | Points computed from client-sent `estimatedPoints` / `pricePerKg`. | Computed server-side from `material_rates`. |
| 10 | S2 | Points on completion were a flat 50 pts/kg regardless of material. | Per-category rates, weight distributed across items. |

### Broken features
| # | Sev | Defect | Fix |
|---|---|---|---|
| 11 | S2 | `PUT /admin/pickups/:id/assign` did not exist, so driver allocation in the admin portal (3 screens) silently failed. | Implemented, with picker/state validation and notifications. |
| 12 | S2 | `/picker/jobs`, `/accept`, `/reject` did not exist; the collector app showed hard-coded "ECO#048" jobs. | Implemented; collector app uses live jobs. |
| 13 | S2 | Collector "Complete Collection" always completed hard-coded `PU-8821` and never called the API. | Completes the job the collector accepted, via the API. |
| 14 | S2 | Mobile "Redeem Reward" never called the API; the balance never changed. | Calls `/wallet/redeem`, shows the result and new balance. |
| 15 | S2 | Mobile pickup request sent `scheduledDate: 'Tomorrow'` plus a hard-coded address. | Real ISO date, time-slot selector, saved addresses. |
| 16 | S2 | Admin "Create Pickup" used free-text names (not linked to a customer) and the past date 2026-08-07. | Customer picker plus date input; server rejects past dates. |
| 17 | S2 | Registration ignored the returned user and logged in as mock "Kasun"; it also used the landmark field as the city. | Uses the created account; address parsed properly. |
| 18 | S2 | Saved addresses, Edit Profile and badge details were static. | Full CRUD / update via the API. |
| 19 | S2 | Reject flow kept the job with the picker; there was no reason validation. | Job returns to the pending pool, reason required, admin alerted. |
| 20 | S3 | Admin dashboard monthly chart, "jobsDone", fleet totals and ESG report were hard-coded. | Aggregated from the DB. |
| 21 | S3 | Allocation screen reset the admin's selected job every 5 s poll. | Selection preserved. |
| 22 | S3 | Admin assign set local status `in_progress` while the server state was `assigned`. | Aligned. |
| 23 | S3 | Errors swallowed everywhere (`catch {}`). Users got fake success. | API returns proper 4xx/5xx JSON; UIs show error messages. |
| 24 | S3 | AI scanner points table disagreed with the DB rates. | Uses `/ai/classify-material` priced from DB. |
| 25 | S1 | **Caller identity was a plain `x-user-id` header**, so anyone could act as any user, including the admin. | Every protected route requires `Authorization: Bearer <JWT>`; `x-user-id` and `?userId=` are ignored. Deactivated accounts' tokens stop working immediately. |
| 26 | S1 | **Admin API had no server-side role check**; any caller could use `/admin/*` and edit material rates. | All `/admin/*` routes and material-rate writes require the admin role (401 without token, 403 for customers/pickers). |
| 27 | S2 | `GET /pickups/:id` returned any pickup to anyone (IDOR, exposes customer phone/address). | Visible only to the owner, the assigned picker and admins (404 otherwise). |

## 4. Test coverage (backend/tests/api.qa.mjs)

| Suite | Checks |
|---|---|
| 01 Health & platform | health, 404 JSON, malformed JSON → 400, CORS |
| 02 Authentication | validation, role escalation, welcome bonus, duplicate email, case-insensitive login, 401/403, no user enumeration, SQL-injection input, JWT `/auth/me` |
| 03 Authentication & role guards | no token / `x-user-id` only / `?userId=` → 401; garbage, wrong-secret and tampered JWTs → 401; admin routes 401/403/200; material-rate writes admin-only; pickup detail scoping |
| 04 Material rates | CRUD, duplicates, invalid numbers, partial update |
| 05 Customer | dashboard ↔ wallet ↔ stats consistency, tiers, profile update, default-address exclusivity, IDOR |
| 06 Pickups | input validation (7 cases), server-side pricing, customer isolation, admin booking, filters |
| 07 End-to-end | create → assign → accept → complete → exact points credit, ledger row, history/stats, badges, illegal transitions |
| 08 Reject/cancel | reason required, return to pool, reassign, cancel rules, IDOR |
| 09 Wallet | redeem validation, insufficient funds, client price tampering, **concurrency**, ledger invariant for every customer |
| 10 Rewards | create/update/soft-delete, catalogue visibility, inactive reward |
| 11 Badges & notifications | unlock = recycled kg, per-user isolation, read/read-all, broadcast fan-out |
| 12 Admin | stats ↔ lists consistency, 6-month chart, fleet, jobsDone, onboard picker, deactivate user (old token rejected), ESG |
| 13 AI | DB-priced classification, invalid category |
| 14 Performance | p95 < 300 ms on core GETs (36 requests in ~93 ms locally) |

## 5. UI verification (in-browser)

- Admin: a wrong password shows "Invalid email or password"; a valid login opens a dashboard populated from Postgres. A bad/expired token clears the session and returns to `/login`.
- Mobile (Expo web): login as Priya → Home shows 2,717 pts, tier "Recycling Master", live pickup PU-8755 with Suresh. The Wallet ledger was reconciled by hand (3,817 earned − 1,100 redeemed = 2,717). No console errors.
- Not clicked through manually: the collector flow on device, camera/photo upload, and native iOS/Android builds. The collector flow is covered end-to-end at the API level (suite 07).

## 6. Open risks / recommendations (not fixed)

1. ~~API trusts `x-user-id`~~: fixed (defects 25–27). Remaining: `JWT_SECRET` falls back to a dev default outside production (the server refuses to start in production without it); tokens last 7 days with no revocation list.
2. Passwords are pre-filled on the mobile login screen (`password123`). Remove before release.
3. No OTP / forgot-password backend; those screens are UI only.
4. No rate limiting on `/auth/login`.
5. Photo proof (camera upload) is not persisted. `backend/uploads/` exists but there's no endpoint.
6. GPS proximity uses a simulated collector position (device location not wired).
7. The AI classifier is a simulation (no Gemini call).
8. Mobile session is in-memory only; it doesn't survive an app restart.
9. `backend/.env` is tracked in git despite `.gitignore`. Rotate the DB password and untrack the file.
10. The test suite writes QA users into the DB. Run `npm run db:setup` before demos for a clean dataset.
