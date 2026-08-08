import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const pgConfig = {
  host: process.env.PG_DB_HOST || 'localhost',
  port: parseInt(process.env.PG_DB_PORT || '5432', 10),
  database: process.env.PG_DB_NAME || 'eco_collect',
  user: process.env.PG_DB_USER || 'postgres',
  password: process.env.PG_DB_PASSWORD || '0006',
};

export const pool = new Pool(pgConfig);

// In-Memory Fallback Cache Store
export const inMemoryStore = {
  users: [
    {
      id: 'CUST-001',
      name: 'Kasun Perera',
      email: 'kasun@gmail.com',
      phone: '+94 77 123 4567',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      street: '15/A Havelock Road',
      city: 'Colombo 05',
      zipCode: '00500',
      ecoRatingTag: 'Green Warrior',
      cityRank: 12
    },
    {
      id: 'PICK-001',
      name: 'Suresh Kumar',
      email: 'suresh@ecocollect.lk',
      phone: '+94 71 987 6543',
      role: 'picker',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      street: 'Main Street',
      city: 'Colombo 03',
      zipCode: '00300',
      rating: 4.9,
      vehicleNumber: 'WP-5842'
    },
    {
      id: 'ADMIN-001',
      name: 'EcoCollect Admin',
      email: 'admin@ecocollect.lk',
      phone: '+94 11 234 5678',
      role: 'admin',
      street: 'HQ Tower',
      city: 'Colombo 01'
    }
  ],
  materialRates: [
    { id: 'MAT-01', category: 'plastic', materialName: 'Plastic (PET Bottles)', pricePerKgLkr: 120, pointsPerKg: 50, icon: '🧴' },
    { id: 'MAT-02', category: 'paper', materialName: 'Paper & Cardboard', pricePerKgLkr: 60, pointsPerKg: 25, icon: '📰' },
    { id: 'MAT-03', category: 'metal', materialName: 'Metal & Steel Scrap', pricePerKgLkr: 150, pointsPerKg: 70, icon: '⚙️' },
    { id: 'MAT-04', category: 'glass', materialName: 'Glass Bottles & Jars', pricePerKgLkr: 30, pointsPerKg: 15, icon: '🫙' },
    { id: 'MAT-05', category: 'e-waste', materialName: 'E-Waste & Gadgets', pricePerKgLkr: 250, pointsPerKg: 100, icon: '💻' }
  ],
  pickups: [
    {
      id: 'PU-8821',
      customerId: 'CUST-001',
      customerName: 'Kasun Perera',
      customerPhone: '+94 77 123 4567',
      pickerId: 'PICK-001',
      pickerName: 'Suresh Kumar',
      items: [
        { category: 'plastic', estimatedWeightKg: 10, actualWeightKg: 12, pricePerKg: 120 },
        { category: 'paper', estimatedWeightKg: 5, actualWeightKg: 5, pricePerKg: 60 }
      ],
      totalEstimatedWeight: 15,
      totalActualWeight: 17,
      estimatedPoints: 300,
      earnedPoints: 340,
      status: 'in_progress',
      pickerStatus: 'accepted',
      rejectionReason: '',
      scheduledDate: '2026-08-06',
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      address: { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
      createdAt: '2026-08-06T08:00:00Z'
    },
    {
      id: 'PU-8820',
      customerId: 'CUST-001',
      customerName: 'Kasun Perera',
      customerPhone: '+94 77 123 4567',
      pickerId: 'PICK-001',
      pickerName: 'Suresh Kumar',
      items: [
        { category: 'metal', estimatedWeightKg: 20, actualWeightKg: 22, pricePerKg: 150 },
        { category: 'glass', estimatedWeightKg: 10, actualWeightKg: 10, pricePerKg: 30 }
      ],
      totalEstimatedWeight: 30,
      totalActualWeight: 32,
      estimatedPoints: 750,
      earnedPoints: 800,
      status: 'completed',
      pickerStatus: 'completed',
      rejectionReason: '',
      scheduledDate: '2026-08-02',
      scheduledTimeSlot: '02:00 PM - 04:00 PM',
      address: { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
      createdAt: '2026-08-01T15:00:00Z',
      completedAt: '2026-08-02T15:30:00Z'
    }
  ],
  wallets: [
    { id: 'WAL-001', userId: 'CUST-001', totalPoints: 2450, cashEquivalentLkr: 490, totalEarned: 3450, totalRedeemed: 1000 }
  ],
  walletTransactions: [
    { id: '1', walletId: 'WAL-001', userId: 'CUST-001', title: 'Plastic Pickup #047', date: 'Today', points: '+125 pts', type: 'earn', icon: '🧴' },
    { id: '2', walletId: 'WAL-001', userId: 'CUST-001', title: 'Mobitel Recharge', date: 'Aug 5', points: '-500 pts', type: 'redeem', icon: '📱' },
    { id: '3', walletId: 'WAL-001', userId: 'CUST-001', title: 'Glass Pickup #041', date: 'Aug 4', points: '+90 pts', type: 'earn', icon: '🫙' }
  ],
  rewards: [
    { id: 'REW-DIALOG-100', title: 'Dialog LKR 100 Mobile Reload', description: 'Instant airtime reload for Dialog (077 / 076 / 074)', pointsRequired: 100, partnerName: 'Dialog Axiata PLC', expiryDate: '2026-12-31' },
    { id: 'REW-MOBITEL-100', title: 'SLT-Mobitel LKR 100 Mobile Reload', description: 'Instant reload top-up for SLT-Mobitel (071 / 070)', pointsRequired: 100, partnerName: 'SLT-Mobitel Sri Lanka', expiryDate: '2026-12-31' }
  ],
  badges: [
    { id: 'BADGE-01', name: 'Eco Starter', description: 'Completed your first 10kg recycling pickup', icon: '🌱', unlockedAt: '2026-07-15', isUnlocked: true, requiredRecycledKg: 10, criteria: 'Recycle 10kg total waste', perksAndMultipliers: '+5% Eco Points' },
    { id: 'BADGE-02', name: 'Plastic Buster', description: 'Recycled over 50kg of plastic waste', icon: '🦸‍♂️', unlockedAt: '2026-08-01', isUnlocked: true, requiredRecycledKg: 50, criteria: 'Recycle over 25.0 kg of PET plastic bottles.', perksAndMultipliers: '+10% Bonus Eco Points on all future plastic collections.' }
  ],
  savedAddresses: [
    { id: '1', userId: 'CUST-001', title: 'Home Address', street: '45 Ward Place', city: 'Colombo 07', isDefault: true }
  ],
  notifications: [
    { id: 'NOTIF-01', userId: 'CUST-001', title: 'Pickup Driver En Route', message: 'Collector Suresh accepted job PU-8821 and is en route (1.2 km away).', timestamp: '10m ago', isRead: false }
  ],
  esgReports: [
    { id: 'ESG-01', label: 'CO2 Emissions Avoided', value: '54.2 Tons', note: 'Equivalent to 2,400 trees planted' }
  ]
};

export async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log(`Connected to PostgreSQL database '${pgConfig.database}' on ${pgConfig.host}:${pgConfig.port}`);

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(30),
        role VARCHAR(20) NOT NULL,
        avatar_url TEXT,
        street VARCHAR(255),
        city VARCHAR(100),
        zip_code VARCHAR(20),
        rating NUMERIC(3, 2) DEFAULT 5.00,
        vehicle_number VARCHAR(50),
        eco_rating_tag VARCHAR(50) DEFAULT 'Green Warrior',
        city_rank INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Material Rates Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS material_rates (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(50) UNIQUE NOT NULL,
        material_name VARCHAR(100) NOT NULL,
        price_per_kg_lkr NUMERIC(10, 2) NOT NULL,
        points_per_kg INT NOT NULL,
        icon VARCHAR(20) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Pickups Table (with rejection_reason and picker_status)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pickups (
        id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(30),
        picker_id VARCHAR(50),
        picker_name VARCHAR(100),
        items_json JSONB NOT NULL,
        total_estimated_weight NUMERIC(10, 2) NOT NULL,
        total_actual_weight NUMERIC(10, 2) DEFAULT 0,
        estimated_points INT DEFAULT 0,
        earned_points INT DEFAULT 0,
        status VARCHAR(30) DEFAULT 'pending',
        picker_status VARCHAR(30) DEFAULT 'assigned',
        rejection_reason TEXT,
        scheduled_date VARCHAR(30) NOT NULL,
        scheduled_time_slot VARCHAR(50) NOT NULL,
        address_json JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);

    // Add rejection_reason column if missing in existing table
    await client.query(`
      ALTER TABLE pickups ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
      ALTER TABLE pickups ADD COLUMN IF NOT EXISTS picker_status VARCHAR(30) DEFAULT 'assigned';
    `);

    // 4. Wallets Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        total_points INT DEFAULT 0,
        cash_equivalent_lkr NUMERIC(10, 2) DEFAULT 0,
        total_earned_points INT DEFAULT 0,
        total_redeemed_points INT DEFAULT 0
      );
    `);

    // 5. Wallet Transactions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id VARCHAR(50) PRIMARY KEY,
        wallet_id VARCHAR(50) REFERENCES wallets(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        points VARCHAR(50) NOT NULL,
        amount_lkr NUMERIC(10, 2) DEFAULT 0,
        date VARCHAR(50) NOT NULL,
        icon VARCHAR(20) DEFAULT '♻️',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Rewards Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rewards (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points_required INT NOT NULL,
        partner_name VARCHAR(100) NOT NULL,
        expiry_date VARCHAR(30) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Badges Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(20) NOT NULL,
        is_unlocked BOOLEAN DEFAULT FALSE,
        unlocked_at VARCHAR(30),
        required_recycled_kg NUMERIC(10, 2) DEFAULT 0,
        criteria TEXT,
        perks_and_multipliers TEXT
      );
    `);

    // 8. Saved Addresses Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_addresses (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE
      );
    `);

    // 9. Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. ESG Reports Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS esg_reports (
        id VARCHAR(50) PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(100) NOT NULL,
        note TEXT NOT NULL
      );
    `);

    // Seed Data if empty
    const uCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(uCount.rows[0].count, 10) === 0) {
      for (const u of inMemoryStore.users) {
        await client.query(
          `INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, eco_rating_tag, city_rank)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
          [u.id, u.name, u.email, u.phone, u.role, u.avatarUrl || '', u.street, u.city, u.zipCode || '', u.rating || 5.0, u.vehicleNumber || '', u.ecoRatingTag || 'Green Warrior', u.cityRank || 1]
        );
      }
    }

    const pCount = await client.query('SELECT COUNT(*) FROM pickups');
    if (parseInt(pCount.rows[0].count, 10) === 0) {
      for (const p of inMemoryStore.pickups) {
        await client.query(
          `INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);`,
          [p.id, p.customerId, p.customerName, p.customerPhone, p.pickerId, p.pickerName, JSON.stringify(p.items), p.totalEstimatedWeight, p.totalActualWeight, p.estimatedPoints, p.earnedPoints, p.status, p.pickerStatus || 'accepted', p.rejectionReason || '', p.scheduledDate, p.scheduledTimeSlot, JSON.stringify(p.address)]
        );
      }
    }

    console.log('PostgreSQL database initialized with job allocation & rejection reason schemas!');
    client.release();
  } catch (error) {
    console.warn('PostgreSQL Database Initialization Warning:', (error as Error).message);
  }
}
