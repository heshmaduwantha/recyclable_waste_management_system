/**
 * Database setup: `tsx src/db/setup.ts [migrate|seed|all]`
 *   migrate -> drop & recreate all tables from schema.sql
 *   seed    -> insert deterministic mock data (requires an empty schema)
 *   all     -> both (default)
 *
 * Every seeded account uses the test password `password123`.
 */
import fs from 'fs';
import path from 'path';
import { pool, hashPassword, POINT_VALUE_LKR, PICKER_COMMISSION_RATE } from '../config/db.js';

const SEED_PASSWORD = 'password123';

// Deterministic PRNG so every seed run produces identical data.
let seedState = 20261118;
const rand = () => {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
};
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const round1 = (n: number) => Math.round(n * 10) / 10;

const DAY = 86_400_000;
const now = new Date();
const daysFromNow = (d: number, hour = 10) => {
  const t = new Date(now.getTime() + d * DAY);
  t.setHours(hour, 0, 0, 0);
  return t;
};
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const materials = [
  { id: 'MAT-01', category: 'plastic', name: 'Plastic (PET Bottles)', price: 120, pts: 50, icon: '🧴' },
  { id: 'MAT-02', category: 'paper', name: 'Paper & Cardboard', price: 60, pts: 25, icon: '📰' },
  { id: 'MAT-03', category: 'metal', name: 'Metal & Steel Scrap', price: 150, pts: 70, icon: '🥫' },
  { id: 'MAT-04', category: 'glass', name: 'Glass Bottles & Jars', price: 30, pts: 15, icon: '🫙' },
  { id: 'MAT-05', category: 'e-waste', name: 'E-Waste & Gadgets', price: 250, pts: 100, icon: '💻' },
  { id: 'MAT-06', category: 'polythene', name: 'Polythene & Soft Plastics', price: 80, pts: 30, icon: '🛍️' },
];
const rateOf = (cat: string) => materials.find((m) => m.category === cat)!;

const customers = [
  { id: 'CUST-001', name: 'Kasun Perera', email: 'kasun@gmail.com', phone: '+94 77 123 4567', street: '15/A Havelock Road', city: 'Colombo 05', zip: '00500', lat: 6.891, lng: 79.858 },
  { id: 'CUST-002', name: 'Priya Jayasinghe', email: 'priya@gmail.com', phone: '+94 77 456 7890', street: '45 Ward Place', city: 'Colombo 07', zip: '00700', lat: 6.9147, lng: 79.8653 },
  { id: 'CUST-003', name: 'Amali Fernando', email: 'amali@gmail.com', phone: '+94 77 999 8888', street: '22 Flower Road', city: 'Colombo 07', zip: '00700', lat: 6.9105, lng: 79.8571 },
  { id: 'CUST-004', name: 'Nimal Silva', email: 'nimal@gmail.com', phone: '+94 77 999 8877', street: '45 Galle Road', city: 'Colombo 03', zip: '00300', lat: 6.9019, lng: 79.8514 },
  { id: 'CUST-005', name: 'Dilini Wickramasinghe', email: 'dilini@gmail.com', phone: '+94 71 555 6677', street: '12 Marine Drive', city: 'Bambalapitiya', zip: '00400', lat: 6.8885, lng: 79.8556 },
  { id: 'CUST-006', name: 'Kamal Rajapaksha', email: 'kamal@gmail.com', phone: '+94 71 222 3344', street: '88 Kandy Road', city: 'Malabe', zip: '10115', lat: 6.9061, lng: 79.9696 },
  { id: 'CUST-007', name: 'Tharindu Bandara', email: 'tharindu@gmail.com', phone: '+94 76 333 1122', street: '5 Temple Road', city: 'Nugegoda', zip: '10250', lat: 6.8721, lng: 79.8889 },
  { id: 'CUST-008', name: 'Sanduni Herath', email: 'sanduni@gmail.com', phone: '+94 70 444 9900', street: '31 Lake Drive', city: 'Rajagiriya', zip: '10107', lat: 6.9094, lng: 79.8966 },
];

const pickers = [
  { id: 'PICK-001', name: 'Suresh Kumar', email: 'suresh@ecocollect.lk', phone: '+94 71 987 6543', city: 'Colombo 03', vehicle: 'WP-5842', type: 'Truck', rating: 4.9, active: true },
  { id: 'PICK-002', name: 'Nuwan Fernando', email: 'nuwan@ecocollect.lk', phone: '+94 77 333 4444', city: 'Colombo 05', vehicle: 'WP-LB-2231', type: 'Lorry', rating: 4.7, active: true },
  { id: 'PICK-003', name: 'Saman Kumara', email: 'saman@ecocollect.lk', phone: '+94 71 888 9999', city: 'Nugegoda', vehicle: 'WP-PH-7712', type: 'Three-wheeler', rating: 4.8, active: true },
  { id: 'PICK-004', name: 'Ruwan Dissanayake', email: 'ruwan@ecocollect.lk', phone: '+94 75 121 3434', city: 'Malabe', vehicle: 'WP-CAB-9087', type: 'Truck', rating: 4.6, active: true },
  { id: 'PICK-005', name: 'Chaminda Perera', email: 'chaminda@ecocollect.lk', phone: '+94 72 909 1010', city: 'Rajagiriya', vehicle: 'WP-LH-4455', type: 'Lorry', rating: 4.4, active: false },
];

const rewards = [
  { id: 'REW-DIALOG-100', title: 'Dialog LKR 100 Mobile Reload', desc: 'Instant airtime reload for Dialog (077 / 076 / 074)', pts: 100, partner: 'Dialog Axiata PLC', icon: '📱', color: '#DC2626' },
  { id: 'REW-MOBITEL-100', title: 'SLT-Mobitel LKR 100 Mobile Reload', desc: 'Instant reload top-up for SLT-Mobitel (071 / 070)', pts: 100, partner: 'SLT-Mobitel Sri Lanka', icon: '📲', color: '#0284C7' },
  { id: 'REW-HUTCH-200', title: 'Hutch LKR 200 Mobile Reload', desc: 'Instant reload for Hutch prepaid (078 / 072)', pts: 200, partner: 'Hutchison Telecom Lanka', icon: '📞', color: '#F97316' },
  { id: 'REW-DIALOG-500', title: 'Dialog LKR 500 Data & Voice Reload', desc: 'LKR 500 reload credit for Dialog prepaid & postpaid', pts: 500, partner: 'Dialog Axiata PLC', icon: '📶', color: '#DC2626' },
  { id: 'REW-MOBITEL-500', title: 'SLT-Mobitel LKR 500 Data & Voice Reload', desc: 'LKR 500 reload credit for SLT-Mobitel prepaid & postpaid', pts: 500, partner: 'SLT-Mobitel Sri Lanka', icon: '⚡', color: '#0284C7' },
  { id: 'REW-KEELLS-1000', title: 'Keells LKR 1,000 Grocery Voucher', desc: 'Redeemable at any Keells Super outlet', pts: 1000, partner: 'John Keells Holdings', icon: '🛒', color: '#16A34A' },
  { id: 'REW-TREE-300', title: 'Plant a Tree Donation', desc: 'We plant a native tree in your name with a reforestation partner', pts: 300, partner: 'Green Lanka Trust', icon: '🌳', color: '#059669' },
];

const badges = [
  { id: 'BADGE-01', name: 'Eco Starter', desc: 'Recycled your first 10 kg of waste', icon: '🌱', kg: 10, criteria: 'Recycle 10 kg total waste', perks: '+5% Eco Points' },
  { id: 'BADGE-02', name: 'Plastic Buster', desc: 'Recycled over 50 kg of waste', icon: '🦸‍♂️', kg: 50, criteria: 'Recycle 50 kg total waste', perks: '+10% bonus points on plastic collections' },
  { id: 'BADGE-03', name: 'Green Guardian', desc: 'Recycled over 100 kg total waste', icon: '🛡️', kg: 100, criteria: 'Recycle 100 kg total waste', perks: 'Priority pickup slots' },
  { id: 'BADGE-04', name: 'Earth Champion', desc: 'Recycled over 250 kg total waste', icon: '🌍', kg: 250, criteria: 'Recycle 250 kg total waste', perks: '+15% Eco Points' },
  { id: 'BADGE-05', name: 'Zero Waste Hero', desc: 'Recycled over 500 kg total waste', icon: '👑', kg: 500, criteria: 'Recycle 500 kg total waste', perks: '+25% Eco Points & free monthly pickup' },
];

const slots = ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];
const activePickers = pickers.filter((p) => p.active);

async function migrate() {
  const sql = fs.readFileSync(path.resolve(process.cwd(), 'src/db/schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✔ Schema created');
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const pwd = hashPassword(SEED_PASSWORD);

    // Users
    const userCreated = (i: number) => daysFromNow(-200 + i * 7);
    for (const [i, c] of customers.entries()) {
      await client.query(
        `INSERT INTO users (id, name, email, phone, role, password_hash, street, city, zip_code, latitude, longitude, created_at)
         VALUES ($1,$2,$3,$4,'customer',$5,$6,$7,$8,$9,$10,$11)`,
        [c.id, c.name, c.email, c.phone, pwd, c.street, c.city, c.zip, c.lat, c.lng, userCreated(i)]
      );
    }
    for (const [i, p] of pickers.entries()) {
      await client.query(
        `INSERT INTO users (id, name, email, phone, role, password_hash, city, rating, vehicle_number, vehicle_type, is_active, created_at)
         VALUES ($1,$2,$3,$4,'picker',$5,$6,$7,$8,$9,$10,$11)`,
        [p.id, p.name, p.email, p.phone, pwd, p.city, p.rating, p.vehicle, p.type, p.active, userCreated(i)]
      );
    }
    await client.query(
      `INSERT INTO users (id, name, email, phone, role, password_hash, street, city, created_at)
       VALUES ('ADMIN-001','EcoCollect Admin','admin@ecocollect.lk','+94 11 234 5678','admin',$1,'HQ Tower','Colombo 01',$2)`,
      [pwd, daysFromNow(-365)]
    );

    for (const m of materials) {
      await client.query(
        `INSERT INTO material_rates (id, category, material_name, price_per_kg_lkr, points_per_kg, icon) VALUES ($1,$2,$3,$4,$5,$6)`,
        [m.id, m.category, m.name, m.price, m.pts, m.icon]
      );
    }
    for (const r of rewards) {
      await client.query(
        `INSERT INTO rewards (id, title, description, points_required, category, partner_name, icon, color, expiry_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'2027-12-31')`,
        [r.id, r.title, r.desc, r.pts, r.id.includes('TREE') ? 'donation' : 'voucher', r.partner, r.icon, r.color]
      );
    }
    for (const b of badges) {
      await client.query(
        `INSERT INTO badges (id, name, description, icon, required_recycled_kg, criteria, perks_and_multipliers) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [b.id, b.name, b.desc, b.icon, b.kg, b.criteria, b.perks]
      );
    }

    // Addresses
    for (const c of customers) {
      await client.query(
        `INSERT INTO saved_addresses (id, user_id, title, street, city, latitude, longitude, is_default) VALUES ($1,$2,'Home Address',$3,$4,$5,$6,TRUE)`,
        [`ADDR-${c.id}-1`, c.id, c.street, c.city, c.lat, c.lng]
      );
    }
    await client.query(
      `INSERT INTO saved_addresses (id, user_id, title, street, city, latitude, longitude, is_default) VALUES
       ('ADDR-CUST-001-2','CUST-001','Office / Business','78 Duplication Road','Colombo 03',6.8982,79.8542,FALSE),
       ('ADDR-CUST-002-2','CUST-002','Parents'' House','9 Lake Road','Kandy',7.2906,80.6337,FALSE)`
    );

    // Wallets
    const wallet: Record<string, { earned: number; redeemed: number }> = {};
    for (const c of customers) {
      wallet[c.id] = { earned: 0, redeemed: 0 };
      await client.query(`INSERT INTO wallets (id, user_id) VALUES ($1,$2)`, [`WAL-${c.id}`, c.id]);
    }

    let txSeq = 1;
    let notifSeq = 1;
    const addTx = async (userId: string, type: string, title: string, points: number, icon: string, at: Date, pickupId?: string, rewardId?: string) => {
      await client.query(
        `INSERT INTO wallet_transactions (id, wallet_id, user_id, type, title, points, icon, pickup_id, reward_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [`TX-${String(txSeq++).padStart(5, '0')}`, `WAL-${userId}`, userId, type, title, points, icon, pickupId || null, rewardId || null, at]
      );
    };
    const addNotif = async (userId: string, title: string, message: string, at: Date, isRead: boolean) => {
      await client.query(
        `INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES ($1,$2,$3,$4,$5,$6)`,
        [`NOTIF-${String(notifSeq++).padStart(5, '0')}`, userId, title, message, isRead, at]
      );
    };

    // Welcome bonus
    for (const [i, c] of customers.entries()) {
      wallet[c.id].earned += 500;
      await addTx(c.id, 'bonus', 'Welcome Bonus', 500, '🎉', userCreated(i));
    }

    // Pickups: history over the last ~6 months + upcoming jobs
    let puSeq = 8700;
    type Plan = { cust: typeof customers[number]; day: number; status: string; pickerStatus: string | null; picker?: typeof pickers[number]; reason?: string };
    const plans: Plan[] = [];
    for (const c of customers) {
      const count = 5 + Math.floor(rand() * 4);
      for (let k = 0; k < count; k++) {
        const day = -175 + Math.floor(rand() * 170);
        const status = rand() < 0.1 ? 'cancelled' : 'completed';
        plans.push({ cust: c, day, status, pickerStatus: status === 'completed' ? 'completed' : null, picker: status === 'completed' ? pick(activePickers) : undefined });
      }
    }
    // Upcoming / active work — gives every role something to act on in QA
    const c = (id: string) => customers.find((x) => x.id === id)!;
    const p = (id: string) => pickers.find((x) => x.id === id)!;
    plans.push(
      { cust: c('CUST-001'), day: 1, status: 'assigned', pickerStatus: 'assigned', picker: p('PICK-001') },
      { cust: c('CUST-002'), day: 0, status: 'in_progress', pickerStatus: 'accepted', picker: p('PICK-001') },
      { cust: c('CUST-003'), day: 1, status: 'assigned', pickerStatus: 'assigned', picker: p('PICK-001') },
      { cust: c('CUST-004'), day: 2, status: 'assigned', pickerStatus: 'assigned', picker: p('PICK-002') },
      { cust: c('CUST-005'), day: 2, status: 'pending', pickerStatus: null, picker: undefined, reason: 'Vehicle capacity full for this route' },
      { cust: c('CUST-006'), day: 3, status: 'pending', pickerStatus: null },
      { cust: c('CUST-007'), day: 3, status: 'pending', pickerStatus: null },
      { cust: c('CUST-008'), day: 4, status: 'pending', pickerStatus: null },
      { cust: c('CUST-002'), day: 5, status: 'pending', pickerStatus: null },
    );
    plans.sort((a, b) => a.day - b.day);

    for (const plan of plans) {
      const id = `PU-${puSeq++}`;
      const cats = [...materials].sort(() => rand() - 0.5).slice(0, 1 + Math.floor(rand() * 3));
      const isDone = plan.status === 'completed';
      const items = cats.map((m) => {
        const est = round1(1.5 + rand() * (m.category === 'e-waste' ? 4 : 12));
        const actual = isDone ? round1(est * (0.9 + rand() * 0.25)) : undefined;
        return { category: m.category, estimatedWeightKg: est, ...(actual !== undefined ? { actualWeightKg: actual } : {}), pricePerKg: m.price };
      });
      const totalEst = round1(items.reduce((s, it) => s + it.estimatedWeightKg, 0));
      const totalAct = isDone ? round1(items.reduce((s, it) => s + (it.actualWeightKg || 0), 0)) : 0;
      const estPts = Math.round(items.reduce((s, it) => s + it.estimatedWeightKg * rateOf(it.category).pts, 0));
      const earnedPts = isDone ? Math.round(items.reduce((s, it) => s + (it.actualWeightKg || 0) * rateOf(it.category).pts, 0)) : 0;
      const valueLkr = Math.round(items.reduce((s, it) => s + (isDone ? it.actualWeightKg || 0 : it.estimatedWeightKg) * it.pricePerKg, 0));
      const commission = isDone ? Math.round(valueLkr * PICKER_COMMISSION_RATE) : 0;

      const createdAt = daysFromNow(Math.min(plan.day - 2, -1), 8);
      const sched = daysFromNow(plan.day, 10);
      const assignedAt = plan.picker ? daysFromNow(Math.min(plan.day - 1, 0), 9) : null;
      const acceptedAt = plan.pickerStatus === 'accepted' || isDone ? daysFromNow(Math.min(plan.day, 0), 9) : null;
      const completedAt = isDone ? daysFromNow(plan.day, 11 + Math.floor(rand() * 5)) : null;

      await client.query(
        `INSERT INTO pickups (id, customer_id, picker_id, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points,
           estimated_value_lkr, picker_commission_lkr, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json,
           created_at, assigned_at, accepted_at, completed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [id, plan.cust.id, plan.picker?.id || null, JSON.stringify(items), totalEst, totalAct, estPts, earnedPts, valueLkr, commission,
          plan.status, plan.pickerStatus, plan.reason || null, isoDate(sched), pick(slots),
          JSON.stringify({ street: plan.cust.street, city: plan.cust.city, latitude: plan.cust.lat, longitude: plan.cust.lng }),
          createdAt, assignedAt, acceptedAt, completedAt]
      );

      const catLabel = cats.map((m) => m.category).join(', ');
      if (isDone) {
        wallet[plan.cust.id].earned += earnedPts;
        await addTx(plan.cust.id, 'earn', `Pickup ${id} · ${catLabel}`, earnedPts, cats[0].icon, completedAt!, id);
        await addNotif(plan.cust.id, '🎉 Pickup Completed & Points Credited!', `Pickup ${id} verified at ${totalAct} kg. +${earnedPts} Eco Points added to your wallet.`, completedAt!, plan.day < -3);
      } else if (plan.status === 'cancelled') {
        await addNotif('ADMIN-001', 'ℹ️ Pickup Cancelled by Customer', `${plan.cust.name} cancelled pickup ${id}.`, createdAt, true);
      } else {
        await addNotif('ADMIN-001', '📦 New Pickup Request Submitted', `${plan.cust.name} submitted pickup ${id} (${totalEst} kg). Open Driver Allocations to dispatch.`, createdAt, plan.status !== 'pending');
        if (plan.picker) {
          await addNotif(plan.picker.id, '🚛 New Job Assigned', `You have been assigned pickup ${id} at ${plan.cust.street}, ${plan.cust.city}.`, assignedAt!, false);
          await addNotif(plan.cust.id, '🚛 Collector Assigned', `${plan.picker.name} will collect pickup ${id} on ${isoDate(sched)}.`, assignedAt!, false);
        }
      }
    }

    // Redemptions — spend part of each wallet, never more than the balance
    let rdSeq = 1;
    for (const cu of customers) {
      const nRedeem = Math.floor(rand() * 4);
      for (let k = 0; k < nRedeem; k++) {
        const reward = pick(rewards);
        const balance = wallet[cu.id].earned - wallet[cu.id].redeemed;
        if (balance - reward.pts < 200) continue;
        wallet[cu.id].redeemed += reward.pts;
        const at = daysFromNow(-60 + Math.floor(rand() * 55), 15);
        await client.query(
          `INSERT INTO redemptions (id, user_id, reward_id, points_spent, mobile_number, created_at) VALUES ($1,$2,$3,$4,$5,$6)`,
          [`RD-${String(rdSeq++).padStart(4, '0')}`, cu.id, reward.id, reward.pts, cu.phone, at]
        );
        await addTx(cu.id, 'redeem', reward.title, -reward.pts, reward.icon, at, undefined, reward.id);
        await addNotif(cu.id, '🎁 Reward Voucher Redeemed!', `You redeemed ${reward.pts} Eco Points for ${reward.title}.`, at, true);
      }
    }

    for (const cu of customers) {
      const w = wallet[cu.id];
      await client.query(
        `UPDATE wallets SET total_points = $1, total_earned_points = $2, total_redeemed_points = $3 WHERE user_id = $4`,
        [w.earned - w.redeemed, w.earned, w.redeemed, cu.id]
      );
    }

    const esg = [
      ['ESG-01', 'Community Clean-up Drives', '14 events', 'Volunteer drives co-hosted with municipal councils', 1],
      ['ESG-02', 'Households Onboarded', `${customers.length} active`, 'Registered households using doorstep collection', 2],
      ['ESG-03', 'Partner Recycling Plants', '6 facilities', 'Certified downstream processors in Western Province', 3],
    ];
    for (const e of esg) {
      await client.query(`INSERT INTO esg_reports (id, label, value, note, sort) VALUES ($1,$2,$3,$4,$5)`, e);
    }

    await client.query('COMMIT');
    const counts = await pool.query(`
      SELECT (SELECT COUNT(*) FROM users) users, (SELECT COUNT(*) FROM pickups) pickups,
             (SELECT COUNT(*) FROM wallet_transactions) transactions, (SELECT COUNT(*) FROM notifications) notifications,
             (SELECT COUNT(*) FROM redemptions) redemptions`);
    console.log('✔ Seed complete', counts.rows[0], `(1 pt = LKR ${POINT_VALUE_LKR})`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

const mode = process.argv[2] || 'all';
(async () => {
  try {
    if (mode === 'migrate' || mode === 'all') await migrate();
    if (mode === 'seed' || mode === 'all') await seed();
  } catch (err) {
    console.error('✖ Database setup failed:', (err as Error).message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
