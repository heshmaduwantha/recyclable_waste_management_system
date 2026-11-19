import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

const { Pool, types } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Return NUMERIC columns as JS numbers and DATE columns as 'YYYY-MM-DD' strings.
types.setTypeParser(1700, (v: string) => parseFloat(v));
types.setTypeParser(1082, (v: string) => v);

export const pgConfig = {
  host: process.env.PG_DB_HOST || 'localhost',
  port: parseInt(process.env.PG_DB_PORT || '5432', 10),
  database: process.env.PG_DB_NAME || 'eco_collect',
  user: process.env.PG_DB_USER || 'postgres',
  password: process.env.PG_DB_PASSWORD,
};

export const pool = new Pool(pgConfig);

/** 1 Eco Point is worth LKR 0.20. */
export const POINT_VALUE_LKR = 0.2;
/** Collector earns this share of the material value of each completed pickup. */
export const PICKER_COMMISSION_RATE = 0.25;

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = (stored || '').split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(plain, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

export async function checkDatabase(): Promise<void> {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pickups'"
  );
  if (rows[0].n === 0) {
    throw new Error('Schema missing. Run `npm run db:setup` in backend/ first.');
  }
  console.log(`Connected to PostgreSQL '${pgConfig.database}' on ${pgConfig.host}:${pgConfig.port}`);
}
