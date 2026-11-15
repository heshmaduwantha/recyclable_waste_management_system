import { randomUUID } from "node:crypto";
import { pool } from "../config/db";
import { PoolClient } from "pg";
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
export const pushConfigured = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
// Persist notifications inside the business transaction, then send push after commit.
export async function notify(
  c: PoolClient,
  userId: string,
  pickupId: string,
  title: string,
  message: string,
) {
  await c.query(
    "INSERT INTO notifications(id,user_id,pickup_id,title,message) VALUES($1,$2,$3,$4,$5)",
    [randomUUID(), userId, pickupId, title, message],
  );
}
export async function sendPush(
  userId: string,
  pickupId: string,
  title: string,
  body: string,
) {
  if (!pushConfigured) return;
  try {
    if (!getApps().length) initializeApp({ credential: applicationDefault() });
    const { rows } = await pool.query(
      "SELECT token FROM device_tokens WHERE user_id=$1",
      [userId],
    );
    for (const row of rows) {
      try {
        await getMessaging().send({
          token: row.token,
          notification: { title, body },
          data: { pickupId },
        });
      } catch (e: any) {
        if (
          [
            "messaging/registration-token-not-registered",
            "messaging/invalid-registration-token",
          ].includes(e.code)
        )
          await pool.query("DELETE FROM device_tokens WHERE token=$1", [
            row.token,
          ]);
        else console.error("Push delivery failed", e.code);
      }
    }
  } catch {
    console.error(
      "FCM delivery failed; in-app notification remains available.",
    );
  }
}
