import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../src/config/db";
import { distanceMeters, rewardPoints } from "../src/domain";
const base = "http://127.0.0.1:4000/api/v1";
async function call(path: string, token = "", body?: any, status = 200) {
  const form = body instanceof FormData;
  const r = await fetch(base + path, {
    method: body ? "POST" : "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body && !form ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });
  const d = await r.json();
  assert.equal(r.status, status, JSON.stringify(d));
  return d;
}
test("GPS and fractional reward calculation", () => {
  assert.equal(distanceMeters(6, 79, 6, 79), 0);
  assert.ok(distanceMeters(6, 79, 6.01, 79) > 1000);
  assert.equal(rewardPoints(1.23, 50), 61.5);
  assert.equal(rewardPoints(2.35, 12.34), 29);
});
test("authorization, photo/GPS validation, concurrent completion, wallet and review", async () => {
  const ids: string[] = [];
  const users: string[] = [];
  try {
    const admin = await call("/auth/login", "", {
      identifier: "admin@ecocollect.lk",
      password: process.env.DEMO_PASSWORD,
    });
    const picker = await call("/auth/login", "", {
      identifier: "picker@ecocollect.lk",
      password: process.env.DEMO_PASSWORD,
    });
    const suffix = Date.now().toString().slice(-7);
    const data = {
      name: "Integration test",
      phone: "077" + suffix,
      password: randomUUID(),
      address: "Test collection address Colombo",
      latitude: 6.9271,
      longitude: 79.8612,
    };
    const customer = await call("/auth/register", "", data, 201);
    users.push(customer.user.id);
    const other = await call(
      "/auth/register",
      "",
      { ...data, phone: "078" + suffix },
      201,
    );
    users.push(other.user.id);
    await call("/pickups", "", undefined, 401);
    await call("/admin/pickers", customer.token, undefined, 403);
    await call(
      "/auth/login",
      "",
      { identifier: data.phone, password: "invalid" },
      401,
    );
    const make = async () => {
      const p = await call(
        "/pickups",
        customer.token,
        {
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          items: [{ category: "plastic", estimated_weight: 2 }],
        },
        201,
      );
      ids.push(p.id);
      await call("/pickups/" + p.id, other.token, undefined, 404);
      await call(`/admin/pickups/${p.id}/assign`, admin.token, {
        picker_id: picker.user.id,
      });
      await call(`/pickups/${p.id}/start`, picker.token, {});
      return p;
    };
    const photo = async (id: string) => {
      const f = new FormData();
      f.append(
        "photo",
        new Blob(
          [
            Buffer.from(
              "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0uoAAAAASUVORK5CYII=",
              "base64",
            ),
          ],
          { type: "image/png" },
        ),
        "proof.png",
      );
      await call(`/pickups/${id}/evidence`, picker.token, f, 201);
    };
    const body = {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: 5,
      items: [{ category: "plastic", weight: 2 }],
    };
    const p = await make();
    await call(`/pickups/${p.id}/complete`, picker.token, body, 400);
    await photo(p.id);
    const results = await Promise.all([
      call(`/pickups/${p.id}/complete`, picker.token, body),
      call(`/pickups/${p.id}/complete`, picker.token, body),
    ]);
    assert.equal(results[0].status, "completed");
    assert.equal(results[0].earned_points, results[1].earned_points);
    const wallet = await call("/wallet", customer.token);
    assert.equal(wallet.balance, results[0].earned_points);
    assert.equal(wallet.transactions.length, 1);
    assert.equal((await call("/wallet", other.token)).balance, 0);
    assert.ok(
      (await call("/badges", customer.token)).some((b: any) => b.awarded_at),
    );
    const p2 = await make();
    await photo(p2.id);
    const result = await call(`/pickups/${p2.id}/complete`, picker.token, {
      ...body,
      latitude: 7,
    });
    assert.equal(result.status, "review_required");
    assert.equal(
      (await call("/wallet", customer.token)).balance,
      wallet.balance,
    );
    await call(`/admin/pickups/${p2.id}/review`, admin.token, {
      approve: true,
      note: "Evidence manually verified in integration test",
    });
    assert.equal(
      (await call("/wallet", customer.token)).transactions.length,
      2,
    );
    await call(
      `/admin/pickups/${p2.id}/review`,
      admin.token,
      { approve: true, note: "Duplicate approval blocked" },
      409,
    );
  } finally {
    if (ids.length) {
      for (const table of [
        "notifications",
        "wallet_transactions",
        "evidence",
        "pickup_items",
      ])
        await pool.query(
          `DELETE FROM ${table} WHERE pickup_id=ANY($1::uuid[])`,
          [ids],
        );
      await pool.query("DELETE FROM pickups WHERE id=ANY($1::uuid[])", [ids]);
    }
    for (const id of users) {
      await pool.query("DELETE FROM user_badges WHERE user_id=$1", [id]);
      await pool.query("DELETE FROM wallets WHERE user_id=$1", [id]);
      await pool.query("DELETE FROM users WHERE id=$1", [id]);
    }
    await pool.end();
  }
});
