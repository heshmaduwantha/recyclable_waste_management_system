/**
 * EcoCollect API — functional QA suite
 *
 * Runs against a live backend (default http://localhost:4000) backed by the seeded QA database.
 *   npm run db:setup   # fresh schema + seed (use a QA database, it drops tables)
 *   npm run dev        # start API
 *   npm run test:api   # this file
 *
 * Tests create their own users/rewards with unique suffixes so they can be re-run without reseeding.
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

const BASE = (process.env.API_URL || 'http://localhost:4000') + '/api/v1';
const RUN = Date.now().toString(36);
const ADMIN = 'ADMIN-001';
const PICKER = 'PICK-001';
const PICKER_2 = 'PICK-002';
const INACTIVE_PICKER = 'PICK-005';
const SEED_CUSTOMER = 'CUST-002';

// Every authenticated call uses the JWT from /auth/login (or /auth/register); x-user-id is not accepted.
const NOAUTH = Symbol('no auth');
const SEED_EMAILS = {
  'ADMIN-001': 'admin@ecocollect.lk', 'PICK-001': 'suresh@ecocollect.lk', 'PICK-002': 'nuwan@ecocollect.lk',
  'PICK-003': 'saman@ecocollect.lk', 'PICK-004': 'ruwan@ecocollect.lk', 'CUST-001': 'kasun@gmail.com',
  'CUST-002': 'priya@gmail.com', 'CUST-003': 'amali@gmail.com',
};
const tokens = new Map();
async function tokenFor(id) {
  if (tokens.has(id)) return tokens.get(id);
  assert.ok(SEED_EMAILS[id], `no credentials known for ${id}`);
  const res = await fetch(BASE + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SEED_EMAILS[id], password: 'password123' }),
  });
  const data = await res.json();
  assert.equal(res.status, 200, `login ${id}: ${JSON.stringify(data)}`);
  tokens.set(id, data.token);
  return data.token;
}
// Calls without an explicit caller go out as the admin when the route is admin-only.
const adminOnly = (method, path) =>
  path.startsWith('/admin') || (path.startsWith('/materials/rates') && method !== 'GET') || (method === 'GET' && path.startsWith('/pickups/'));

async function api(method, path, { as, body, raw } = {}) {
  const headers = {};
  if (as === undefined && adminOnly(method, path)) as = ADMIN;
  if (as && as !== NOAUTH) headers.Authorization = `Bearer ${await tokenFor(as)}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const t0 = performance.now();
  const res = await fetch(BASE + path, { method, headers, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  const ms = performance.now() - t0;
  const data = await res.json().catch(() => null);
  return { status: res.status, data, ms };
}
const get = (p, as) => api('GET', p, { as });
const post = (p, body, as) => api('POST', p, { body, as });
const put = (p, body, as) => api('PUT', p, { body, as });
const del = (p, as) => api('DELETE', p, { as });
const tomorrow = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

async function newCustomer(tag) {
  const r = await post('/auth/register', {
    name: `QA ${tag}`, email: `qa.${tag}.${RUN}@example.test`, phone: '+94 77 000 0000', password: 'secret123',
    address: { street: '1 QA Lane', city: 'Colombo 01' },
  });
  assert.equal(r.status, 201, JSON.stringify(r.data));
  tokens.set(r.data.id, r.data.token);
  return r.data;
}

async function createPickup(customerId, items = [{ category: 'plastic', estimatedWeightKg: 4 }, { category: 'paper', estimatedWeightKg: 6 }]) {
  const r = await post('/pickups', { items, scheduledDate: tomorrow(), scheduledTimeSlot: '10:00 AM - 12:00 PM' }, customerId);
  assert.equal(r.status, 201, JSON.stringify(r.data));
  return r.data;
}

before(async () => {
  if (process.env.QA_SKIP_HEALTH) return; // used when benchmarking an older build without /health
  const h = await get('/health');
  assert.equal(h.status, 200, 'API not reachable — start the backend first');
});

// --------------------------------------------------------------------------
describe('01 · Health & platform', () => {
  it('health reports DB connected', async () => {
    const r = await get('/health');
    assert.equal(r.data.status, 'ok');
    assert.equal(r.data.database, 'connected');
  });
  it('unknown endpoint → 404 JSON', async () => {
    const r = await get('/does-not-exist');
    assert.equal(r.status, 404);
    assert.ok(r.data.error);
  });
  it('malformed JSON body → 400 (not 500)', async () => {
    const res = await fetch(BASE + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"email":' });
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /Malformed JSON/);
  });
  it('CORS header present', async () => {
    const res = await fetch(BASE + '/health', { headers: { Origin: 'http://localhost:5173' } });
    assert.ok(res.headers.get('access-control-allow-origin'));
  });
});

// --------------------------------------------------------------------------
describe('02 · Authentication', () => {
  it('register rejects missing fields', async () => {
    const r = await post('/auth/register', { email: 'x@y.test' });
    assert.equal(r.status, 400);
    assert.match(r.data.error, /name|password/);
  });
  it('register rejects invalid email', async () => {
    assert.equal((await post('/auth/register', { name: 'A', email: 'not-an-email', password: 'secret123' })).status, 400);
  });
  it('register rejects short password', async () => {
    assert.equal((await post('/auth/register', { name: 'A', email: `a.${RUN}@x.test`, password: '123' })).status, 400);
  });
  it('register rejects admin role escalation', async () => {
    assert.equal((await post('/auth/register', { name: 'A', email: `esc.${RUN}@x.test`, password: 'secret123', role: 'admin' })).status, 400);
  });
  it('register creates user, wallet with 500 welcome bonus, address and notification', async () => {
    const u = await newCustomer('reg');
    assert.equal(u.role, 'customer');
    assert.ok(u.token, 'JWT token returned');
    assert.equal(u.password_hash, undefined, 'password hash must never be returned');
    const w = await get('/wallet', u.id);
    assert.equal(w.data.totalPoints, 500);
    const tx = await get('/wallet/transactions', u.id);
    assert.equal(tx.data.length, 1);
    assert.equal(tx.data[0].pointsValue, 500);
    const addr = await get('/customer/addresses', u.id);
    assert.equal(addr.data.length, 1);
    assert.equal(addr.data[0].isDefault, true);
    const n = await get('/notifications', u.id);
    assert.ok(n.data.some((x) => /Welcome/.test(x.title)));
  });
  it('duplicate email (case-insensitive) → 409', async () => {
    const u = await newCustomer('dup');
    const r = await post('/auth/register', { name: 'B', email: u.email.toUpperCase(), password: 'secret123' });
    assert.equal(r.status, 409);
  });
  it('login succeeds with seeded credentials', async () => {
    const r = await post('/auth/login', { email: 'priya@gmail.com', password: 'password123', role: 'customer' });
    assert.equal(r.status, 200);
    assert.equal(r.data.id, SEED_CUSTOMER);
  });
  it('login is case-insensitive on email', async () => {
    assert.equal((await post('/auth/login', { email: 'PRIYA@Gmail.com', password: 'password123' })).status, 200);
  });
  it('wrong password → 401', async () => {
    assert.equal((await post('/auth/login', { email: 'priya@gmail.com', password: 'nope' })).status, 401);
  });
  it('unknown email → 401 (same message, no user enumeration)', async () => {
    const a = await post('/auth/login', { email: 'ghost@nowhere.test', password: 'x' });
    const b = await post('/auth/login', { email: 'priya@gmail.com', password: 'x' });
    assert.equal(a.status, 401);
    assert.equal(a.data.error, b.data.error);
  });
  it('role mismatch → 403', async () => {
    assert.equal((await post('/auth/login', { email: 'priya@gmail.com', password: 'password123', role: 'picker' })).status, 403);
  });
  it('deactivated account cannot log in', async () => {
    assert.equal((await post('/auth/login', { email: 'chaminda@ecocollect.lk', password: 'password123' })).status, 403);
  });
  it('SQL-injection style input is handled safely', async () => {
    const r = await post('/auth/login', { email: "' OR 1=1 --", password: "' OR '1'='1" });
    assert.equal(r.status, 401);
  });
  it('admin can log in', async () => {
    const r = await post('/auth/login', { email: 'admin@ecocollect.lk', password: 'password123', role: 'admin' });
    assert.equal(r.status, 200);
    assert.equal(r.data.role, 'admin');
  });
  it('/auth/me resolves bearer token', async () => {
    const login = await post('/auth/login', { email: 'kasun@gmail.com', password: 'password123' });
    const res = await fetch(BASE + '/auth/me', { headers: { Authorization: `Bearer ${login.data.token}` } });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).id, 'CUST-001');
  });
});

// --------------------------------------------------------------------------
describe('03 · Authentication (JWT) & role guards', () => {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const sign = (payload, secret) => {
    const head = b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64(payload);
    return head + '.' + createHmac('sha256', secret).update(head).digest('base64url');
  };
  const withToken = (path, token) => fetch(BASE + path, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.status);

  it('customer endpoint without token → 401', async () => {
    assert.equal((await get('/wallet', NOAUTH)).status, 401);
  });
  it('x-user-id header alone is not accepted → 401', async () => {
    const res = await fetch(BASE + '/wallet', { headers: { 'x-user-id': SEED_CUSTOMER } });
    assert.equal(res.status, 401);
  });
  it('userId query param alone is not accepted → 401', async () => {
    assert.equal((await get(`/wallet?userId=${SEED_CUSTOMER}`, NOAUTH)).status, 401);
  });
  it('garbage / forged / tampered tokens → 401', async () => {
    assert.equal(await withToken('/wallet', 'not-a-jwt'), 401);
    const now = Math.floor(Date.now() / 1000);
    assert.equal(await withToken('/admin/stats', sign({ sub: ADMIN, role: 'admin', iat: now }, 'wrong-secret')), 401);
    const [h, , sig] = (await tokenFor(SEED_CUSTOMER)).split('.');
    assert.equal(await withToken('/admin/stats', `${h}.${b64({ sub: ADMIN, role: 'admin', iat: now })}.${sig}`), 401);
  });
  it('admin endpoints: no token → 401, customer/picker → 403, admin → 200', async () => {
    assert.equal((await get('/admin/stats', NOAUTH)).status, 401);
    assert.equal((await get('/admin/stats', SEED_CUSTOMER)).status, 403);
    assert.equal((await get('/admin/pickups', PICKER)).status, 403);
    assert.equal((await put(`/admin/users/${SEED_CUSTOMER}/status`, { isActive: false }, SEED_CUSTOMER)).status, 403);
    assert.equal((await get('/admin/stats', ADMIN)).status, 200);
  });
  it('material rate writes are admin-only; reads stay public', async () => {
    assert.equal((await put('/materials/rates/plastic', { pricePerKgLkr: 1 }, SEED_CUSTOMER)).status, 403);
    assert.equal((await post('/materials/rates', { category: 'x' }, NOAUTH)).status, 401);
    assert.equal((await del('/materials/rates/plastic', PICKER)).status, 403);
    assert.equal((await get('/materials/rates', NOAUTH)).status, 200);
  });
  it('pickup detail is scoped: owner, assigned picker and admin only', async () => {
    const mine = (await get('/pickups', SEED_CUSTOMER)).data[0];
    assert.equal((await get(`/pickups/${mine.id}`, SEED_CUSTOMER)).status, 200);
    assert.equal((await get(`/pickups/${mine.id}`, 'CUST-001')).status, 404);
    assert.equal((await get(`/pickups/${mine.id}`, NOAUTH)).status, 401);
    const job = (await get('/picker/jobs', PICKER)).data[0];
    assert.equal((await get(`/pickups/${job.id}`, PICKER)).status, 200);
    assert.equal((await get(`/pickups/${job.id}`, PICKER_2)).status, 404);
  });
  it('picker cannot read customer wallet → 403', async () => {
    assert.equal((await get('/wallet', PICKER)).status, 403);
  });
  it('customer cannot read picker jobs → 403', async () => {
    assert.equal((await get('/picker/jobs', SEED_CUSTOMER)).status, 403);
  });
  it('picker cannot create pickups → 403', async () => {
    const r = await post('/pickups', { items: [{ category: 'plastic', estimatedWeightKg: 1 }], scheduledDate: tomorrow(), scheduledTimeSlot: 'x' }, PICKER);
    assert.equal(r.status, 403);
  });
});

// --------------------------------------------------------------------------
describe('04 · Material rates', () => {
  let createdId;
  const cat = `qa-mat-${RUN}`;
  it('lists 6 seeded categories sorted by category', async () => {
    const r = await get('/materials/rates');
    assert.equal(r.status, 200);
    const cats = r.data.map((m) => m.category);
    for (const c of ['plastic', 'paper', 'metal', 'glass', 'e-waste', 'polythene']) assert.ok(cats.includes(c), c);
    assert.deepEqual(cats, [...cats].sort());
    assert.equal(typeof r.data[0].pricePerKgLkr, 'number');
  });
  it('create validates required + positive numbers', async () => {
    assert.equal((await post('/materials/rates', { category: cat })).status, 400);
    assert.equal((await post('/materials/rates', { category: cat, materialName: 'X', pricePerKgLkr: -5, pointsPerKg: 1 })).status, 400);
  });
  it('create → 201, duplicate → 409', async () => {
    const r = await post('/materials/rates', { category: cat, materialName: 'QA Material', pricePerKgLkr: 10, pointsPerKg: 5 });
    assert.equal(r.status, 201);
    createdId = r.data.id;
    assert.equal((await post('/materials/rates', { category: cat, materialName: 'Again', pricePerKgLkr: 10, pointsPerKg: 5 })).status, 409);
  });
  it('update by id and by category', async () => {
    const a = await put(`/materials/rates/${createdId}`, { pricePerKgLkr: 12 });
    assert.equal(a.data.material.pricePerKgLkr, 12);
    const b = await put(`/materials/rates/${cat}`, { pointsPerKg: 7 });
    assert.equal(b.data.material.pointsPerKg, 7);
    assert.equal(b.data.material.pricePerKgLkr, 12, 'partial update keeps other fields');
  });
  it('update rejects invalid values and unknown id', async () => {
    assert.equal((await put(`/materials/rates/${createdId}`, { pricePerKgLkr: 'abc' })).status, 400);
    assert.equal((await put('/materials/rates/MAT-NOPE', { pricePerKgLkr: 1 })).status, 404);
  });
  it('delete → 200 then 404', async () => {
    assert.equal((await del(`/materials/rates/${createdId}`)).status, 200);
    assert.equal((await del(`/materials/rates/${createdId}`)).status, 404);
  });
  it('/admin/reward-rates mirrors material points', async () => {
    const [rates, rr] = await Promise.all([get('/materials/rates'), get('/admin/reward-rates')]);
    for (const m of rates.data) assert.equal(rr.data.find((x) => x.category === m.category).pointsPerKg, m.pointsPerKg);
  });
});

// --------------------------------------------------------------------------
describe('05 · Customer profile, dashboard & addresses', () => {
  let u;
  before(async () => { u = await newCustomer('addr'); });

  it('dashboard aggregates are consistent with wallet + stats endpoints', async () => {
    const [d, w, ws, s] = await Promise.all([
      get('/customer/dashboard', SEED_CUSTOMER), get('/wallet', SEED_CUSTOMER), get('/wallet/stats', SEED_CUSTOMER), get('/customer/stats', SEED_CUSTOMER),
    ]);
    assert.equal(d.status, 200);
    assert.equal(d.data.wallet.totalPoints, w.data.totalPoints);
    assert.equal(d.data.wallet.totalEarned - d.data.wallet.totalRedeemed, w.data.totalPoints);
    assert.equal(d.data.stats.recycledKg, s.data.recycledKg);
    assert.equal(ws.data.totalPickups, s.data.completedPickups);
    assert.equal(w.data.cashEquivalentLkr, +(w.data.totalPoints * 0.2).toFixed(2));
  });
  it('tier & progress derived from lifetime earned points', async () => {
    const [p, lvl, d] = await Promise.all([get('/customer/progress', SEED_CUSTOMER), get('/customer/eco-level', SEED_CUSTOMER), get('/customer/dashboard', SEED_CUSTOMER)]);
    assert.equal(p.data.currentPoints, d.data.wallet.totalEarned);
    assert.ok(p.data.percentage >= 0 && p.data.percentage <= 100);
    assert.equal(lvl.data.tierName, d.data.tier.tierName);
  });
  it('new customer starts as Eco Starter with no rank-breaking nulls', async () => {
    const p = await get('/customer/profile', u.id);
    assert.equal(p.data.tierName, 'Eco Starter');
    assert.equal(p.data.recycledKg, 0);
  });
  it('profile update validates email and persists', async () => {
    assert.equal((await put('/customer/profile', { email: 'bad' }, u.id)).status, 400);
    assert.equal((await put('/customer/profile', { email: 'priya@gmail.com' }, u.id)).status, 409);
    const r = await put('/customer/profile', { name: 'QA Renamed', phone: '+94 70 111 2222' }, u.id);
    assert.equal(r.data.name, 'QA Renamed');
    assert.equal((await get('/customer/profile', u.id)).data.phone, '+94 70 111 2222');
  });
  it('address add requires fields', async () => {
    assert.equal((await post('/customer/addresses', { title: 'X' }, u.id)).status, 400);
  });
  it('only one default address at a time', async () => {
    const a = await post('/customer/addresses', { title: 'Office', street: '2 Work St', city: 'Colombo 02', isDefault: true }, u.id);
    assert.equal(a.status, 201);
    const list = (await get('/customer/addresses', u.id)).data;
    assert.equal(list.filter((x) => x.isDefault).length, 1);
    assert.equal(list.find((x) => x.isDefault).id, a.data.id);
  });
  it('deleting default promotes another address', async () => {
    const list = (await get('/customer/addresses', u.id)).data;
    const def = list.find((x) => x.isDefault);
    assert.equal((await del(`/customer/addresses/${def.id}`, u.id)).status, 200);
    const after = (await get('/customer/addresses', u.id)).data;
    assert.equal(after.length, list.length - 1);
    assert.equal(after.filter((x) => x.isDefault).length, 1);
  });
  it('cannot modify another customer\'s address (IDOR)', async () => {
    const victim = (await get('/customer/addresses', SEED_CUSTOMER)).data[0];
    assert.equal((await del(`/customer/addresses/${victim.id}`, u.id)).status, 404);
    assert.equal((await put(`/customer/addresses/${victim.id}`, { title: 'pwned' }, u.id)).status, 404);
    assert.ok((await get('/customer/addresses', SEED_CUSTOMER)).data.some((x) => x.id === victim.id && x.title !== 'pwned'));
  });
});

// --------------------------------------------------------------------------
describe('06 · Pickup creation & visibility', () => {
  let u;
  before(async () => { u = await newCustomer('pu'); });

  it('rejects empty items / unknown category / bad weight / past date / missing slot', async () => {
    const base = { scheduledDate: tomorrow(), scheduledTimeSlot: '10:00 AM - 12:00 PM' };
    assert.equal((await post('/pickups', { ...base, items: [] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { ...base, items: [{ category: 'uranium', estimatedWeightKg: 1 }] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { ...base, items: [{ category: 'plastic', estimatedWeightKg: -3 }] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { ...base, items: [{ category: 'plastic', estimatedWeightKg: 0 }] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { ...base, scheduledDate: '2020-01-01', items: [{ category: 'plastic', estimatedWeightKg: 1 }] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { ...base, scheduledDate: 'not-a-date', items: [{ category: 'plastic', estimatedWeightKg: 1 }] }, u.id)).status, 400);
    assert.equal((await post('/pickups', { scheduledDate: tomorrow(), items: [{ category: 'plastic', estimatedWeightKg: 1 }] }, u.id)).status, 400);
  });
  it('server computes points/value from DB rates (ignores client-supplied numbers)', async () => {
    const rates = Object.fromEntries((await get('/materials/rates')).data.map((m) => [m.category, m]));
    const r = await post('/pickups', {
      items: [{ category: 'plastic', estimatedWeightKg: 4, pricePerKg: 99999 }, { category: 'metal', estimatedWeightKg: 2 }],
      estimatedPoints: 1_000_000, totalEstimatedWeight: 999,
      scheduledDate: tomorrow(), scheduledTimeSlot: '10:00 AM - 12:00 PM',
    }, u.id);
    assert.equal(r.status, 201);
    assert.equal(r.data.totalEstimatedWeight, 6);
    assert.equal(r.data.estimatedPoints, Math.round(4 * rates.plastic.pointsPerKg + 2 * rates.metal.pointsPerKg));
    assert.equal(r.data.items[0].pricePerKg, rates.plastic.pricePerKgLkr);
    assert.equal(r.data.status, 'pending');
    assert.equal(r.data.customerId, u.id);
    assert.equal(r.data.address.street, '1 QA Lane', 'defaults to customer home address');
  });
  it('customer cannot book on behalf of another customer', async () => {
    const r = await post('/pickups', { customerId: SEED_CUSTOMER, items: [{ category: 'paper', estimatedWeightKg: 1 }], scheduledDate: tomorrow(), scheduledTimeSlot: 'x' }, u.id);
    assert.equal(r.data.customerId, u.id);
  });
  it('admin can book on behalf of a customer (customerId required)', async () => {
    assert.equal((await post('/pickups', { items: [{ category: 'paper', estimatedWeightKg: 1 }], scheduledDate: tomorrow(), scheduledTimeSlot: 'x' }, ADMIN)).status, 400);
    const r = await post('/pickups', { customerId: u.id, items: [{ category: 'paper', estimatedWeightKg: 1 }], scheduledDate: tomorrow(), scheduledTimeSlot: 'x' }, ADMIN);
    assert.equal(r.status, 201);
    assert.equal(r.data.customerName, 'QA pu');
  });
  it('customer sees only own pickups; admin sees all', async () => {
    const mine = (await get('/pickups', u.id)).data;
    assert.ok(mine.length >= 2);
    assert.ok(mine.every((p) => p.customerId === u.id));
    const all = (await get('/admin/pickups')).data;
    assert.ok(all.length > mine.length);
    assert.ok(new Set(all.map((p) => p.customerId)).size > 1);
  });
  it('status filter works', async () => {
    const r = await get('/admin/pickups?status=completed');
    assert.ok(r.data.length > 0);
    assert.ok(r.data.every((p) => p.status === 'completed'));
  });
  it('get by id → 200 / 404', async () => {
    const p = (await get('/pickups', u.id)).data[0];
    assert.equal((await get(`/pickups/${p.id}`)).data.id, p.id);
    assert.equal((await get('/pickups/PU-NOPE')).status, 404);
  });
  it('new pickup notifies admin', async () => {
    const p = await createPickup(u.id);
    const n = (await get('/notifications', ADMIN)).data;
    assert.ok(n.some((x) => x.message.includes(p.id)));
  });
});

// --------------------------------------------------------------------------
describe('07 · End-to-end: request → assign → accept → complete → points credited', () => {
  let u, pickup, walletBefore;
  before(async () => {
    u = await newCustomer('e2e');
    pickup = await createPickup(u.id);
    walletBefore = (await get('/wallet', u.id)).data.totalPoints;
  });

  it('assign validates picker', async () => {
    assert.equal((await put(`/admin/pickups/${pickup.id}/assign`, {})).status, 400);
    assert.equal((await put(`/admin/pickups/${pickup.id}/assign`, { pickerId: 'PICK-NOPE' })).status, 404);
    assert.equal((await put(`/admin/pickups/${pickup.id}/assign`, { pickerId: SEED_CUSTOMER })).status, 404, 'customer is not a picker');
    assert.equal((await put(`/admin/pickups/${pickup.id}/assign`, { pickerId: INACTIVE_PICKER })).status, 409);
    assert.equal((await put('/admin/pickups/PU-NOPE/assign', { pickerId: PICKER })).status, 404);
  });
  it('assign → status assigned, picker sees job, both parties notified', async () => {
    const r = await put(`/admin/pickups/${pickup.id}/assign`, { pickerId: PICKER });
    assert.equal(r.status, 200);
    assert.equal(r.data.pickup.status, 'assigned');
    assert.equal(r.data.pickup.pickerName, 'Suresh Kumar');
    const jobs = (await get('/picker/jobs', PICKER)).data;
    const job = jobs.find((j) => j.id === pickup.id);
    assert.ok(job);
    assert.equal(job.jobStatus, 'Assigned');
    assert.ok(job.addressText && job.details);
    assert.ok((await get('/notifications', PICKER)).data.some((n) => n.message.includes(pickup.id)));
    assert.ok((await get('/notifications', u.id)).data.some((n) => /Collector Assigned/.test(n.title)));
  });
  it('other picker cannot act on the job (403)', async () => {
    assert.equal((await put(`/picker/jobs/${pickup.id}/accept`, undefined, PICKER_2)).status, 403);
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: 5 }, PICKER_2)).status, 403);
  });
  it('cannot complete before accepting (409)', async () => {
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: 5 }, PICKER)).status, 409);
  });
  it('accept → in_progress; double-accept → 409', async () => {
    const r = await put(`/picker/jobs/${pickup.id}/accept`, undefined, PICKER);
    assert.equal(r.status, 200);
    assert.equal((await get(`/pickups/${pickup.id}`)).data.status, 'in_progress');
    assert.equal((await put(`/picker/jobs/${pickup.id}/accept`, undefined, PICKER)).status, 409);
  });
  it('customer cannot cancel once collector is en route', async () => {
    assert.equal((await put(`/pickups/${pickup.id}/cancel`, undefined, u.id)).status, 409);
  });
  it('complete validates weight', async () => {
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, {}, PICKER)).status, 400);
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: -1 }, PICKER)).status, 400);
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: 5000 }, PICKER)).status, 400);
  });
  it('complete credits exactly earnedPoints to the customer wallet + ledger', async () => {
    const rates = Object.fromEntries((await get('/materials/rates')).data.map((m) => [m.category, m]));
    const r = await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: 12 }, PICKER);
    assert.equal(r.status, 200);
    // items: plastic 4/10, paper 6/10 of 12 kg
    const expected = Math.round(4.8 * rates.plastic.pointsPerKg + 7.2 * rates.paper.pointsPerKg);
    assert.equal(r.data.earnedPoints, expected);
    assert.equal(r.data.commissionLkr, +((4.8 * rates.plastic.pricePerKgLkr + 7.2 * rates.paper.pricePerKgLkr) * 0.25).toFixed(2));
    const w = (await get('/wallet', u.id)).data;
    assert.equal(w.totalPoints, walletBefore + expected);
    const tx = (await get('/wallet/transactions', u.id)).data;
    assert.ok(tx.some((t) => t.pickupId === pickup.id && t.pointsValue === expected));
    const p = (await get(`/pickups/${pickup.id}`)).data;
    assert.equal(p.status, 'completed');
    assert.equal(p.totalActualWeight, 12);
    assert.ok(p.completedAt);
  });
  it('completing twice is rejected and does not double-credit', async () => {
    const before = (await get('/wallet', u.id)).data.totalPoints;
    assert.equal((await put(`/picker/jobs/${pickup.id}/complete`, { actualWeightKg: 12 }, PICKER)).status, 409);
    assert.equal((await get('/wallet', u.id)).data.totalPoints, before);
  });
  it('job leaves the active queue and appears in picker history/stats', async () => {
    assert.ok(!(await get('/picker/jobs', PICKER)).data.some((j) => j.id === pickup.id));
    const h = (await get('/picker/history', PICKER)).data;
    assert.equal(h[0].id, pickup.id, 'most recent first');
    const s = (await get('/picker/stats', PICKER)).data;
    assert.ok(s.today.jobs >= 1);
    assert.ok(s.totalEarningsLkr > 0);
  });
  it('admin cannot reassign a completed pickup', async () => {
    assert.equal((await put(`/admin/pickups/${pickup.id}/assign`, { pickerId: PICKER_2 })).status, 409);
  });
  it('badge progress reflects new recycled kg', async () => {
    const b = (await get('/badges', u.id)).data;
    const starter = b.find((x) => x.requiredRecycledKg === 10);
    assert.equal(starter.isUnlocked, true);
    assert.ok(starter.unlockedAt);
    assert.equal(b.find((x) => x.requiredRecycledKg === 50).isUnlocked, false);
  });
});

// --------------------------------------------------------------------------
describe('08 · Rejection & cancellation flows', () => {
  let u;
  before(async () => { u = await newCustomer('rej'); });

  it('reject requires reason; rejection returns job to pending pool and alerts admin', async () => {
    const p = await createPickup(u.id);
    await put(`/admin/pickups/${p.id}/assign`, { pickerId: PICKER_2 });
    assert.equal((await put(`/picker/jobs/${p.id}/reject`, { reason: '  ' }, PICKER_2)).status, 400);
    const r = await put(`/picker/jobs/${p.id}/reject`, { reason: 'Truck capacity full' }, PICKER_2);
    assert.equal(r.status, 200);
    const after = (await get(`/pickups/${p.id}`)).data;
    assert.equal(after.status, 'pending');
    assert.equal(after.pickerId, undefined);
    assert.equal(after.rejectionReason, 'Truck capacity full');
    assert.ok((await get('/notifications', ADMIN)).data.some((n) => n.message.includes(p.id) && /rejected/i.test(n.message)));
    // reassign clears reason
    const re = await put(`/admin/pickups/${p.id}/assign`, { pickerId: PICKER });
    assert.equal(re.data.pickup.rejectionReason, null);
  });
  it('customer can cancel pending/assigned; picker loses the job', async () => {
    const p = await createPickup(u.id);
    await put(`/admin/pickups/${p.id}/assign`, { pickerId: PICKER });
    assert.equal((await put(`/pickups/${p.id}/cancel`, undefined, u.id)).status, 200);
    assert.equal((await get(`/pickups/${p.id}`)).data.status, 'cancelled');
    assert.ok(!(await get('/picker/jobs', PICKER)).data.some((j) => j.id === p.id));
    assert.equal((await put(`/pickups/${p.id}/cancel`, undefined, u.id)).status, 409, 'already cancelled');
  });
  it('customer cannot cancel someone else\'s pickup (IDOR)', async () => {
    const other = (await get('/pickups', SEED_CUSTOMER)).data.find((p) => p.status === 'pending');
    assert.ok(other, 'seed has a pending pickup for CUST-002');
    assert.equal((await put(`/pickups/${other.id}/cancel`, undefined, u.id)).status, 403);
  });
  it('cancel unknown pickup → 404', async () => {
    assert.equal((await put('/pickups/PU-NOPE/cancel', undefined, u.id)).status, 404);
  });
});

// --------------------------------------------------------------------------
describe('09 · Wallet & reward redemption', () => {
  let u, cheap, pricey;
  before(async () => {
    u = await newCustomer('wal'); // 500 pts
    cheap = (await post('/admin/rewards', { title: `QA 100 ${RUN}`, pointsRequired: 100, partnerName: 'QA Partner' })).data;
    pricey = (await post('/admin/rewards', { title: `QA 99999 ${RUN}`, pointsRequired: 99999, partnerName: 'QA Partner' })).data;
  });

  it('redeem validates input', async () => {
    assert.equal((await post('/wallet/redeem', {}, u.id)).status, 400);
    assert.equal((await post('/wallet/redeem', { rewardId: 'REW-NOPE' }, u.id)).status, 404);
  });
  it('insufficient balance → 400 and balance unchanged', async () => {
    const r = await post('/wallet/redeem', { rewardId: pricey.id }, u.id);
    assert.equal(r.status, 400);
    assert.equal((await get('/wallet', u.id)).data.totalPoints, 500);
  });
  it('client cannot choose the price (pointsRequired in body is ignored)', async () => {
    const r = await post('/wallet/redeem', { rewardId: cheap.id, pointsRequired: 1, mobileNumber: '0771234567' }, u.id);
    assert.equal(r.status, 200);
    assert.equal(r.data.newBalance, 400);
  });
  it('redeem writes ledger + notification; stats reflect it', async () => {
    const tx = (await get('/wallet/transactions?type=redeem', u.id)).data;
    assert.equal(tx.length, 1);
    assert.equal(tx[0].pointsValue, -100);
    assert.equal(tx[0].points, '-100 pts');
    const st = (await get('/wallet/stats', u.id)).data;
    assert.equal(st.totalRedeemed, 100);
    assert.ok((await get('/notifications', u.id)).data.some((n) => /Redeemed/.test(n.title)));
  });
  it('concurrent redemptions never overdraw the wallet (race condition)', async () => {
    // balance 400, reward 100 → at most 4 of 10 parallel requests may succeed
    const results = await Promise.all(Array.from({ length: 10 }, () => post('/wallet/redeem', { rewardId: cheap.id }, u.id)));
    const ok = results.filter((r) => r.status === 200).length;
    assert.equal(ok, 4, `expected 4 successes, got ${ok}`);
    assert.ok(results.every((r) => [200, 400].includes(r.status)));
    assert.equal((await get('/wallet', u.id)).data.totalPoints, 0);
  });
  it('ledger invariant: balance == sum(transactions) for every seeded customer', async () => {
    const customers = (await get('/admin/customers')).data;
    for (const c of customers) {
      // Log in as each customer: seed accounts use password123, QA-created ones secret123.
      if (!tokens.has(c.id)) {
        for (const password of ['password123', 'secret123']) {
          const l = await post('/auth/login', { email: c.email, password }, NOAUTH);
          if (l.status === 200) { tokens.set(c.id, l.data.token); break; }
        }
      }
      if (!tokens.has(c.id)) continue; // deactivated or unknown password: not reachable as that user
      const [w, tx, st] = await Promise.all([get('/wallet', c.id), get('/wallet/transactions', c.id), get('/wallet/stats', c.id)]);
      const sum = tx.data.reduce((s, t) => s + t.pointsValue, 0);
      assert.equal(w.data.totalPoints, sum, `${c.id} balance ${w.data.totalPoints} != ledger ${sum}`);
      assert.equal(st.data.totalEarned - st.data.totalRedeemed, w.data.totalPoints, `${c.id} earned-redeemed mismatch`);
      assert.ok(w.data.totalPoints >= 0);
    }
  });
  it('transaction type filter', async () => {
    const earn = (await get('/wallet/transactions?type=earn', SEED_CUSTOMER)).data;
    assert.ok(earn.length > 0 && earn.every((t) => t.pointsValue > 0));
  });
});

// --------------------------------------------------------------------------
describe('10 · Rewards catalogue (admin)', () => {
  let r;
  it('create validates', async () => {
    assert.equal((await post('/admin/rewards', { title: 'x' })).status, 400);
    assert.equal((await post('/admin/rewards', { title: 'x', partnerName: 'y', pointsRequired: 0 })).status, 400);
  });
  it('create → appears in customer catalogue sorted by points', async () => {
    r = (await post('/admin/rewards', { title: `QA Cat ${RUN}`, pointsRequired: 150, partnerName: 'QA' })).data;
    const cat = (await get('/rewards/catalogue')).data;
    assert.ok(cat.some((x) => x.id === r.id));
    const pts = cat.map((x) => x.pointsRequired);
    assert.deepEqual(pts, [...pts].sort((a, b) => a - b));
  });
  it('update + soft delete removes from catalogue but keeps admin record', async () => {
    assert.equal((await put(`/admin/rewards/${r.id}`, { pointsRequired: 175 })).data.pointsRequired, 175);
    assert.equal((await del(`/admin/rewards/${r.id}`)).status, 200);
    assert.ok(!(await get('/rewards/catalogue')).data.some((x) => x.id === r.id));
    assert.ok((await get('/admin/rewards')).data.some((x) => x.id === r.id && x.isActive === false));
  });
  it('inactive reward cannot be redeemed', async () => {
    const u = await newCustomer('inact');
    assert.equal((await post('/wallet/redeem', { rewardId: r.id }, u.id)).status, 404);
  });
  it('admin list includes redemption counts', async () => {
    const list = (await get('/admin/rewards')).data;
    assert.ok(list.some((x) => x.redemptions > 0));
  });
});

// --------------------------------------------------------------------------
describe('11 · Badges & notifications', () => {
  it('anonymous badge list has no unlock state', async () => {
    const b = (await get('/badges')).data;
    assert.equal(b.length >= 5, true);
    assert.ok(b.every((x) => x.isUnlocked === false));
  });
  it('badge unlocks match recycled kg', async () => {
    const [b, s] = await Promise.all([get('/badges', SEED_CUSTOMER), get('/customer/stats', SEED_CUSTOMER)]);
    for (const x of b.data) assert.equal(x.isUnlocked, s.data.recycledKg >= x.requiredRecycledKg, x.name);
  });
  it('admin create badge validates', async () => {
    assert.equal((await post('/admin/badges', { name: 'x' })).status, 400);
    const r = await post('/admin/badges', { name: `QA Badge ${RUN}`, requiredRecycledKg: 9999 });
    assert.equal(r.status, 201);
    assert.equal((await del(`/admin/badges/${r.data.id}`)).status, 200);
  });
  it('notifications are per-user and newest first', async () => {
    const a = (await get('/notifications', 'CUST-001')).data;
    const b = (await get('/notifications', SEED_CUSTOMER)).data;
    assert.ok(a.length && b.length);
    assert.ok(!a.some((n) => b.find((m) => m.id === n.id)));
    const t = a.map((n) => new Date(n.createdAt).getTime());
    assert.deepEqual(t, [...t].sort((x, y) => y - x));
  });
  it('mark one read, mark all read, 404 on foreign notification', async () => {
    const u = await newCustomer('notif');
    const n = (await get('/notifications', u.id)).data[0];
    assert.equal((await put(`/notifications/${n.id}/read`, undefined, u.id)).status, 200);
    const foreign = (await get('/notifications', SEED_CUSTOMER)).data[0];
    assert.equal((await put(`/notifications/${foreign.id}/read`, undefined, u.id)).status, 404);
    await createPickup(u.id);
    assert.equal((await put('/notifications/read-all', undefined, u.id)).status, 200);
    assert.ok((await get('/notifications', u.id)).data.every((x) => x.isRead));
  });
  it('admin broadcast reaches every active customer; targeted send validates user', async () => {
    const customers = (await get('/admin/customers')).data.filter((c) => c.isActive);
    const r = await post('/admin/notifications', { title: `QA Broadcast ${RUN}`, message: 'hello' });
    assert.equal(r.status, 201);
    assert.equal(r.data.recipients, customers.length);
    assert.ok((await get('/notifications', SEED_CUSTOMER)).data.some((n) => n.title === `QA Broadcast ${RUN}`));
    assert.equal((await post('/admin/notifications', { title: 'x', message: 'y', userId: 'NOPE' })).status, 404);
    assert.equal((await post('/admin/notifications', { title: 'x' })).status, 400);
  });
});

// --------------------------------------------------------------------------
describe('12 · Admin dashboard, fleet, users & reports', () => {
  it('stats are consistent with underlying lists', async () => {
    const [s, pu, cu, done] = await Promise.all([get('/admin/stats'), get('/admin/pickups'), get('/admin/customers'), get('/admin/pickups?status=completed')]);
    assert.equal(s.data.totalPickups, pu.data.length);
    assert.equal(s.data.totalCustomers, cu.data.length);
    const kg = done.data.reduce((a, p) => a + p.totalActualWeight, 0);
    assert.ok(Math.abs(s.data.wasteCollectedKg - kg) < 0.2, `${s.data.wasteCollectedKg} vs ${kg}`);
    assert.match(s.data.recycledRate, /^\d+(\.\d)?%$/);
  });
  it('monthly chart returns last 6 months with numeric series', async () => {
    const r = (await get('/admin/charts/monthly-waste')).data;
    assert.equal(r.length, 6);
    assert.equal(r[5].month, new Date().toLocaleString('en-US', { month: 'short' }));
    for (const m of r) for (const k of ['plastic', 'paper', 'glass', 'metal', 'eWaste']) assert.equal(typeof m[k], 'number');
    assert.ok(r.some((m) => m.plastic > 0));
  });
  it('fleet status counts', async () => {
    const [f, pk, pend] = await Promise.all([get('/admin/fleet-status'), get('/admin/pickers'), get('/admin/pickups?status=pending')]);
    assert.equal(f.data.totalDrivers, pk.data.length);
    assert.equal(f.data.activeDrivers, pk.data.filter((p) => p.isActive).length);
    assert.equal(f.data.pendingPickups, pend.data.length);
  });
  it('pickers list includes real jobsDone', async () => {
    const pk = (await get('/admin/pickers')).data;
    const s = (await get('/picker/stats', PICKER)).data;
    assert.equal(pk.find((p) => p.id === PICKER).jobsDone, s.totalJobsDone);
  });
  it('onboard picker validates and rejects duplicates', async () => {
    assert.equal((await post('/admin/pickers', { name: 'X' })).status, 400);
    const body = { name: 'QA Driver', email: `driver.${RUN}@example.test`, phone: '+94 71 000 0000', vehicleNumber: 'QA-1' };
    const r = await post('/admin/pickers', body);
    assert.equal(r.status, 201);
    assert.equal(r.data.role, 'picker');
    assert.equal((await post('/admin/pickers', body)).status, 409);
    const login = await post('/auth/login', { email: body.email, password: 'password123', role: 'picker' });
    assert.equal(login.status, 200, 'new picker can log in with default password');
  });
  it('deactivate/reactivate user; admin cannot be deactivated', async () => {
    const u = await newCustomer('deact');
    assert.equal((await put(`/admin/users/${u.id}/status`, { isActive: false })).data.isActive, false);
    assert.equal((await post('/auth/login', { email: u.email, password: 'secret123' })).status, 403);
    assert.equal((await get('/wallet', u.id)).status, 403, 'existing token stops working once deactivated');
    assert.equal((await put(`/admin/users/${u.id}/status`, { isActive: true })).data.isActive, true);
    assert.equal((await put(`/admin/users/${ADMIN}/status`, { isActive: false })).status, 404);
    assert.equal((await put(`/admin/users/${u.id}/status`, { isActive: 'no' })).status, 400);
  });
  it('ESG report derived from completed kg', async () => {
    const [r, s] = await Promise.all([get('/admin/reports'), get('/admin/stats')]);
    assert.ok(r.data.length >= 4);
    assert.equal(r.data[0].value, `${s.data.wasteCollectedKg.toFixed(1)} kg`);
  });
});

// --------------------------------------------------------------------------
describe('13 · AI classifier', () => {
  it('returns DB-priced classification for a category', async () => {
    const [r, rates] = await Promise.all([post('/ai/classify-material', { category: 'metal' }), get('/materials/rates')]);
    assert.equal(r.status, 200);
    assert.equal(r.data.pointsPerKg, rates.data.find((m) => m.category === 'metal').pointsPerKg);
  });
  it('unknown category → 400', async () => {
    assert.equal((await post('/ai/classify-material', { category: 'kryptonite' })).status, 400);
  });
});

// --------------------------------------------------------------------------
describe('14 · Performance smoke (p95 < 300 ms on local DB)', () => {
  it('core GET endpoints respond quickly', async () => {
    const paths = [
      ['/customer/dashboard', SEED_CUSTOMER], ['/wallet/transactions', SEED_CUSTOMER], ['/pickups', SEED_CUSTOMER],
      ['/picker/jobs', PICKER], ['/picker/stats', PICKER], ['/admin/stats'], ['/admin/pickups'], ['/admin/charts/monthly-waste'],
      ['/admin/customers'], ['/admin/reports'], ['/rewards/catalogue'], ['/materials/rates'],
    ];
    const times = [];
    for (let i = 0; i < 3; i++) for (const [p, as] of paths) {
      const r = await get(p, as);
      assert.equal(r.status, 200, p);
      times.push(r.ms);
    }
    times.sort((a, b) => a - b);
    const p95 = times[Math.floor(times.length * 0.95)];
    assert.ok(p95 < 300, `p95 ${p95.toFixed(0)} ms`);
  });
});
