import { PoolClient } from "pg";
import { pool } from "../config/db";
// A single aggregate query keeps client payloads consistent across web and mobile.
export async function listPickups(
  actor: { id: string; role: string },
  id?: string,
) {
  const { rows } = await pool.query(
    `SELECT p.*,u.name customer_name,u.phone customer_phone,k.name picker_name,
 COALESCE((SELECT json_agg(i ORDER BY category) FROM pickup_items i WHERE i.pickup_id=p.id),'[]') items,
 COALESCE((SELECT json_agg(json_build_object('id',e.id,'mime_type',e.mime_type)) FROM evidence e WHERE e.pickup_id=p.id),'[]') evidence
 FROM pickups p JOIN users u ON u.id=p.customer_id LEFT JOIN users k ON k.id=p.picker_id
 WHERE ($1='admin' OR ($1='customer' AND p.customer_id=$2) OR ($1='picker' AND p.picker_id=$2))
 AND ($3::uuid IS NULL OR p.id=$3) ORDER BY p.created_at DESC LIMIT 500`,
    [actor.role, actor.id, id || null],
  );
  return rows;
}
export async function lockPickup(c: PoolClient, id: string) {
  return (await c.query("SELECT * FROM pickups WHERE id=$1 FOR UPDATE", [id]))
    .rows[0];
}
