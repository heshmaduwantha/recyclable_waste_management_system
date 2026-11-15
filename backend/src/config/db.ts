import "dotenv/config";
import { Pool, PoolClient } from "pg";
import fs from "node:fs/promises";
import path from "node:path";
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  connectionTimeoutMillis: 5000,
});
// Migrations fail fast: no substitute in-memory data is ever returned.
export async function migrate() {
  const sql = await fs.readFile(
    path.resolve("migrations/001_core.sql"),
    "utf8",
  );
  await pool.query(sql);
}
export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const value = await fn(c);
    await c.query("COMMIT");
    return value;
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}
