import { randomUUID } from "node:crypto";
import { PoolClient } from "pg";
import { transaction } from "../config/db";
import { distanceMeters, rewardPoints, requireCondition } from "../domain";
import { lockPickup } from "../repositories/pickups";
import { notify } from "./notifications";
// Every eligible badge is assigned once, in the same transaction as the wallet credit.
async function awardBadges(c: PoolClient, userId: string) {
  const {
    rows: [stats],
  } = await c.query(
    `SELECT COUNT(DISTINCT p.id)::int collections,COALESCE(SUM(i.actual_weight),0)::float weight,COUNT(DISTINCT i.category) FILTER(WHERE i.actual_weight>0)::int diversity FROM pickups p JOIN pickup_items i ON i.pickup_id=p.id WHERE p.customer_id=$1 AND p.status='completed'`,
    [userId],
  );
  const { rows: badges } = await c.query("SELECT * FROM badges");
  for (const b of badges)
    if (Number(stats[b.criterion]) >= Number(b.threshold))
      await c.query(
        "INSERT INTO user_badges(user_id,badge_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [userId, b.id],
      );
}
async function credit(c: PoolClient, p: any) {
  const { rows: items } = await c.query(
    "SELECT * FROM pickup_items WHERE pickup_id=$1",
    [p.id],
  );
  const total =
    Math.round(items.reduce((s, i) => s + Number(i.points), 0) * 100) / 100;
  requireCondition(
    total > 0,
    400,
    "Collection must earn a positive number of points.",
  );
  await c.query(
    "INSERT INTO wallet_transactions(id,user_id,pickup_id,points) VALUES($1,$2,$3,$4)",
    [randomUUID(), p.customer_id, p.id, total],
  );
  await c.query("UPDATE wallets SET balance=balance+$1 WHERE user_id=$2", [
    total,
    p.customer_id,
  ]);
  await c.query(
    "UPDATE pickups SET status='completed',earned_points=$1,completed_at=now() WHERE id=$2",
    [total, p.id],
  );
  await awardBadges(c, p.customer_id);
  await notify(
    c,
    p.customer_id,
    p.id,
    "Collection completed",
    `${total} eco-points added to your wallet.`,
  );
  return { status: "completed", earned_points: total };
}
export async function completeCollection(
  id: string,
  pickerId: string,
  data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    items: { category: string; weight: number }[];
  },
) {
  return transaction(async (c) => {
    const p = await lockPickup(c, id);
    requireCondition(p, 404, "Pickup not found.");
    requireCondition(
      p.picker_id === pickerId,
      403,
      "This job is assigned to another picker.",
    );
    if (p.status === "completed")
      return { status: p.status, earned_points: Number(p.earned_points) };
    requireCondition(
      p.status === "in_progress",
      409,
      "Start the job before completing it.",
    );
    const {
      rows: [photo],
    } = await c.query("SELECT id FROM evidence WHERE pickup_id=$1 LIMIT 1", [
      id,
    ]);
    requireCondition(photo, 400, "Upload at least one collection photo.");
    const { rows: items } = await c.query(
      "SELECT i.category,m.points_per_kg FROM pickup_items i JOIN materials m USING(category) WHERE pickup_id=$1 ORDER BY i.category FOR SHARE OF m",
      [id],
    );
    requireCondition(
      data.items.length === items.length &&
        new Set(data.items.map((i) => i.category)).size === items.length &&
        items.every((i) => data.items.some((w) => w.category === i.category)),
      400,
      "Provide a verified weight for every requested material.",
    );
    requireCondition(
      data.items.some((i) => i.weight > 0),
      400,
      "At least one material must have a positive weight.",
    );
    for (const item of items) {
      const w = data.items.find((i) => i.category === item.category)!.weight;
      await c.query(
        "UPDATE pickup_items SET actual_weight=$1,rate_snapshot=$2,points=$3 WHERE pickup_id=$4 AND category=$5",
        [
          w,
          item.points_per_kg,
          rewardPoints(w, Number(item.points_per_kg)),
          id,
          item.category,
        ],
      );
    }
    const distance = distanceMeters(
      p.latitude,
      p.longitude,
      data.latitude,
      data.longitude,
    );
    const {
      rows: [setting],
    } = await c.query(
      "SELECT value FROM settings WHERE key='gps_radius_meters'",
    );
    const radius = Number(setting.value);
    const reason =
      distance > radius
        ? `Location is ${Math.round(distance)} m away (limit ${radius} m).`
        : data.accuracy > radius
          ? `GPS accuracy ${Math.round(data.accuracy)} m exceeds the ${radius} m limit.`
          : null;
    await c.query(
      "UPDATE pickups SET gps_latitude=$1,gps_longitude=$2,gps_accuracy=$3,distance_meters=$4,review_reason=$5 WHERE id=$6",
      [data.latitude, data.longitude, data.accuracy, distance, reason, id],
    );
    if (reason) {
      await c.query("UPDATE pickups SET status='review_required' WHERE id=$1", [
        id,
      ]);
      await notify(
        c,
        p.customer_id,
        id,
        "Collection under review",
        "The collection location needs administrator review.",
      );
      return { status: "review_required", earned_points: 0, reason };
    }
    return credit(c, p);
  });
}
export async function reviewCollection(
  id: string,
  adminId: string,
  approve: boolean,
  note: string,
) {
  return transaction(async (c) => {
    const p = await lockPickup(c, id);
    requireCondition(p, 404, "Pickup not found.");
    requireCondition(
      p.status === "review_required",
      409,
      "This collection is not awaiting review.",
    );
    await c.query(
      "UPDATE pickups SET reviewed_by=$1,review_note=$2 WHERE id=$3",
      [adminId, note, id],
    );
    if (approve) return credit(c, p);
    await c.query("UPDATE pickups SET status='in_progress' WHERE id=$1", [id]);
    await notify(c, p.picker_id, id, "Collection needs correction", note);
    return { status: "in_progress", earned_points: 0 };
  });
}
