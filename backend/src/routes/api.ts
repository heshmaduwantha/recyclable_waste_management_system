import { Router, Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool, transaction } from "../config/db";
import { authenticate, roles, signToken } from "../auth";
import {
  publicUser,
  categories,
  coordinates,
  HttpError,
  requireCondition,
} from "../domain";
import { listPickups, lockPickup } from "../repositories/pickups";
import { completeCollection, reviewCollection } from "../services/collections";
import { notify, sendPush, pushConfigured } from "../services/notifications";
export const api = Router();
const run =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);
const phone = z
  .string()
  .trim()
  .regex(/^(?:\+94|0)\d{9}$/, "Use a Sri Lankan phone number, e.g. 0771234567.")
  .transform((s) => (s.startsWith("0") ? "+94" + s.slice(1) : s));
const password = z.string().min(8).max(128);
const person = z.object({
  name: z.string().trim().min(2).max(100),
  phone,
  email: z.union([z.string().email().max(200), z.literal("")]).optional(),
  password,
});
const register = person.extend({
  address: z.string().trim().min(5).max(500),
  ...coordinates.shape,
});
const weight = z
  .number()
  .min(0)
  .max(10000)
  .refine(
    (v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.00001,
    "Use at most two decimal places.",
  );
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
api.post(
  "/auth/register",
  loginLimit,
  run(async (req, res) => {
    const d = register.parse(req.body);
    const id = randomUUID();
    const hash = await bcrypt.hash(d.password, 12);
    const u = await transaction(async (c) => {
      const { rows } = await c.query(
        "INSERT INTO users(id,name,phone,email,password_hash,role,address,latitude,longitude) VALUES($1,$2,$3,$4,$5,'customer',$6,$7,$8) RETURNING *",
        [
          id,
          d.name,
          d.phone,
          d.email || null,
          hash,
          d.address,
          d.latitude,
          d.longitude,
        ],
      );
      await c.query("INSERT INTO wallets(user_id) VALUES($1)", [id]);
      return rows[0];
    });
    res.status(201).json({ user: publicUser(u), token: signToken(u) });
  }),
);
api.post(
  "/auth/login",
  loginLimit,
  run(async (req, res) => {
    const d = z
      .object({
        identifier: z.string().trim().min(3).max(200),
        password: z.string().max(128),
      })
      .parse(req.body);
    const id = d.identifier.startsWith("0")
      ? "+94" + d.identifier.slice(1)
      : d.identifier;
    const {
      rows: [u],
    } = await pool.query(
      "SELECT * FROM users WHERE (phone=$1 OR lower(email)=lower($1)) AND active=true",
      [id],
    );
    requireCondition(
      u && (await bcrypt.compare(d.password, u.password_hash)),
      401,
      "Incorrect phone/email or password.",
    );
    res.json({ user: publicUser(u), token: signToken(u) });
  }),
);
api.use(authenticate);
api.get(
  "/me",
  run(async (req, res) =>
    res.json(
      publicUser(
        (await pool.query("SELECT * FROM users WHERE id=$1", [req.actor.id]))
          .rows[0],
      ),
    ),
  ),
);
api.put(
  "/me",
  run(async (req, res) => {
    const d = register
      .omit({ password: true, email: true, phone: true })
      .parse(req.body);
    res.json(
      publicUser(
        (
          await pool.query(
            "UPDATE users SET name=$1,address=$2,latitude=$3,longitude=$4 WHERE id=$5 RETURNING *",
            [d.name, d.address, d.latitude, d.longitude, req.actor.id],
          )
        ).rows[0],
      ),
    );
  }),
);
api.get(
  "/config",
  run(async (_req, res) =>
    res.json({
      telecomEnabled: false,
      photoAiEnabled: false,
      pushConfigured,
      gpsRadiusMeters: Number(
        (
          await pool.query(
            "SELECT value FROM settings WHERE key='gps_radius_meters'",
          )
        ).rows[0].value,
      ),
    }),
  ),
);
api.get(
  "/materials",
  run(async (_req, res) =>
    res.json((await pool.query("SELECT * FROM materials ORDER BY name")).rows),
  ),
);
api.put(
  "/admin/materials/:category",
  roles("admin"),
  run(async (req, res) => {
    const category = z.enum(categories).parse(req.params.category);
    const { points_per_kg } = z
      .object({ points_per_kg: z.number().positive().max(100000) })
      .parse(req.body);
    res.json(
      (
        await pool.query(
          "UPDATE materials SET points_per_kg=$1,updated_at=now() WHERE category=$2 RETURNING *",
          [points_per_kg, category],
        )
      ).rows[0],
    );
  }),
);
api.put(
  "/admin/settings",
  roles("admin"),
  run(async (req, res) => {
    const d = z
      .object({ gpsRadiusMeters: z.number().int().min(25).max(5000) })
      .parse(req.body);
    await pool.query(
      "UPDATE settings SET value=$1 WHERE key='gps_radius_meters'",
      [String(d.gpsRadiusMeters)],
    );
    res.json(d);
  }),
);
api.get(
  "/pickups",
  run(async (req, res) => res.json(await listPickups(req.actor))),
);
api.get(
  "/pickups/:id",
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const p = (await listPickups(req.actor, id))[0];
    requireCondition(p, 404, "Pickup not found.");
    res.json(p);
  }),
);
api.post(
  "/pickups",
  roles("customer"),
  run(async (req, res) => {
    const d = z
      .object({
        address: z.string().trim().min(5).max(500),
        ...coordinates.shape,
        notes: z.string().max(500).default(""),
        items: z
          .array(
            z.object({
              category: z.enum(categories),
              estimated_weight: weight.refine((v) => v > 0),
            }),
          )
          .min(1)
          .max(4),
      })
      .parse(req.body);
    requireCondition(
      new Set(d.items.map((i) => i.category)).size === d.items.length,
      400,
      "Select each material only once.",
    );
    const id = randomUUID();
    await transaction(async (c) => {
      await c.query(
        "INSERT INTO pickups(id,customer_id,address,latitude,longitude,notes) VALUES($1,$2,$3,$4,$5,$6)",
        [id, req.actor.id, d.address, d.latitude, d.longitude, d.notes],
      );
      for (const i of d.items)
        await c.query(
          "INSERT INTO pickup_items(pickup_id,category,estimated_weight) VALUES($1,$2,$3)",
          [id, i.category, i.estimated_weight],
        );
    });
    res.status(201).json((await listPickups(req.actor, id))[0]);
  }),
);
api.post(
  "/pickups/:id/cancel",
  roles("customer"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const { rows } = await pool.query(
      "UPDATE pickups SET status='cancelled' WHERE id=$1 AND customer_id=$2 AND status='pending' RETURNING id",
      [id, req.actor.id],
    );
    requireCondition(
      rows.length,
      409,
      "Only your pending requests can be cancelled.",
    );
    res.json({ status: "cancelled" });
  }),
);
api.post(
  "/admin/pickups/:id/assign",
  roles("admin"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const { picker_id } = z
      .object({ picker_id: z.string().uuid() })
      .parse(req.body);
    const body = await transaction(async (c) => {
      const p = await lockPickup(c, id);
      requireCondition(p, 404, "Pickup not found.");
      requireCondition(
        p.status === "pending" || p.status === "assigned",
        409,
        "This job cannot be assigned now.",
      );
      const { rows } = await c.query(
        "SELECT id FROM users WHERE id=$1 AND role='picker' AND active=true",
        [picker_id],
      );
      requireCondition(rows.length, 400, "Choose an active picker.");
      await c.query(
        "UPDATE pickups SET picker_id=$1,status='assigned' WHERE id=$2",
        [picker_id, id],
      );
      const { rows: items } = await c.query(
        "SELECT category,estimated_weight FROM pickup_items WHERE pickup_id=$1",
        [id],
      );
      const message = `${p.address} · ${items.map((i) => `${i.category}: ${i.estimated_weight} kg`).join(", ")}`;
      await notify(c, picker_id, id, "New collection assigned", message);
      await notify(
        c,
        p.customer_id,
        id,
        "Picker assigned",
        "A picker has been assigned to your request.",
      );
      return message;
    });
    void sendPush(picker_id, id, "New collection assigned", body);
    res.json({ status: "assigned" });
  }),
);
api.post(
  "/pickups/:id/start",
  roles("picker"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    await transaction(async (c) => {
      const p = await lockPickup(c, id);
      requireCondition(
        p && p.picker_id === req.actor.id,
        404,
        "Job not found.",
      );
      requireCondition(
        p.status === "assigned",
        409,
        "Only an assigned job can be started.",
      );
      await c.query("UPDATE pickups SET status='in_progress' WHERE id=$1", [
        id,
      ]);
      await notify(
        c,
        p.customer_id,
        id,
        "Collection in progress",
        "Your picker has started the collection.",
      );
    });
    res.json({ status: "in_progress" });
  }),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024, files: 1 },
});
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
api.post(
  "/pickups/:id/evidence",
  roles("picker"),
  upload.single("photo"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const file = req.file;
    requireCondition(file, 400, "Choose a photo.");
    const jpeg =
      file.buffer[0] === 255 &&
      file.buffer[1] === 216 &&
      file.buffer[2] === 255;
    const png = file.buffer
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    requireCondition(jpeg || png, 400, "Upload a JPEG or PNG photo.");
    const eid = randomUUID();
    const filename = `${eid}.${jpeg ? "jpg" : "png"}`;
    await fs.mkdir(uploadDir, { recursive: true });
    try {
      await transaction(async (c) => {
        const p = await lockPickup(c, id);
        requireCondition(
          p && p.picker_id === req.actor.id,
          404,
          "Job not found.",
        );
        requireCondition(
          p.status === "in_progress",
          409,
          "Start the job before uploading evidence.",
        );
        const count = Number(
          (
            await c.query("SELECT count(*) FROM evidence WHERE pickup_id=$1", [
              id,
            ])
          ).rows[0].count,
        );
        requireCondition(
          count < 5,
          400,
          "A maximum of five photos is allowed.",
        );
        await fs.writeFile(path.join(uploadDir, filename), file.buffer);
        await c.query(
          "INSERT INTO evidence(id,pickup_id,uploaded_by,filename,mime_type) VALUES($1,$2,$3,$4,$5)",
          [eid, id, req.actor.id, filename, jpeg ? "image/jpeg" : "image/png"],
        );
      });
    } catch (e) {
      await fs.unlink(path.join(uploadDir, filename)).catch(() => {});
      throw e;
    }
    res.status(201).json({ id: eid });
  }),
);
api.get(
  "/evidence/:id",
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const {
      rows: [e],
    } = await pool.query(
      "SELECT e.*,p.customer_id,p.picker_id FROM evidence e JOIN pickups p ON p.id=e.pickup_id WHERE e.id=$1",
      [id],
    );
    requireCondition(
      e &&
        (req.actor.role === "admin" ||
          e.customer_id === req.actor.id ||
          e.picker_id === req.actor.id),
      404,
      "Photo not found.",
    );
    res.type(e.mime_type).sendFile(path.join(uploadDir, e.filename));
  }),
);
api.post(
  "/pickups/:id/complete",
  roles("picker"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const d = z
      .object({
        ...coordinates.shape,
        accuracy: z.number().min(0).max(100000),
        items: z
          .array(z.object({ category: z.enum(categories), weight }))
          .min(1)
          .max(4),
      })
      .parse(req.body);
    res.json(await completeCollection(id, req.actor.id, d));
  }),
);
api.post(
  "/admin/pickups/:id/review",
  roles("admin"),
  run(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const d = z
      .object({
        approve: z.boolean(),
        note: z.string().trim().min(5).max(1000),
      })
      .parse(req.body);
    res.json(await reviewCollection(id, req.actor.id, d.approve, d.note));
  }),
);
api.get(
  "/wallet",
  roles("customer"),
  run(async (req, res) => {
    const [w, t, stats] = await Promise.all([
      pool.query("SELECT balance FROM wallets WHERE user_id=$1", [
        req.actor.id,
      ]),
      pool.query(
        `SELECT t.*,COALESCE((SELECT json_agg(i) FROM pickup_items i WHERE i.pickup_id=t.pickup_id),'[]') items FROM wallet_transactions t WHERE t.user_id=$1 ORDER BY t.created_at DESC`,
        [req.actor.id],
      ),
      pool.query(
        "SELECT COUNT(DISTINCT p.id)::int collections,COALESCE(SUM(i.actual_weight),0)::float weight FROM pickups p JOIN pickup_items i ON i.pickup_id=p.id WHERE p.customer_id=$1 AND p.status='completed'",
        [req.actor.id],
      ),
    ]);
    res.json({
      balance: Number(w.rows[0]?.balance || 0),
      transactions: t.rows,
      ...stats.rows[0],
    });
  }),
);
api.get(
  "/badges",
  run(async (req, res) =>
    res.json(
      (
        await pool.query(
          "SELECT b.*,ub.awarded_at FROM badges b LEFT JOIN user_badges ub ON ub.badge_id=b.id AND ub.user_id=$1 ORDER BY threshold",
          [req.actor.id],
        )
      ).rows,
    ),
  ),
);
api.post(
  "/admin/badges",
  roles("admin"),
  run(async (req, res) => {
    const d = z
      .object({
        name: z.string().trim().min(2).max(80),
        criterion: z.enum(["weight", "collections", "diversity"]),
        threshold: z.number().positive().max(100000),
        description: z.string().trim().min(5).max(300),
      })
      .parse(req.body);
    if (d.criterion === "diversity")
      requireCondition(
        Number.isInteger(d.threshold) && d.threshold <= 4,
        400,
        "Diversity threshold must be 1–4.",
      );
    if (d.criterion === "collections")
      requireCondition(
        Number.isInteger(d.threshold),
        400,
        "Collection count must be an integer.",
      );
    res
      .status(201)
      .json(
        (
          await pool.query(
            "INSERT INTO badges(id,name,criterion,threshold,description) VALUES($1,$2,$3,$4,$5) RETURNING *",
            [randomUUID(), d.name, d.criterion, d.threshold, d.description],
          )
        ).rows[0],
      );
  }),
);
api.get(
  "/notifications",
  run(async (req, res) =>
    res.json(
      (
        await pool.query(
          "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",
          [req.actor.id],
        )
      ).rows,
    ),
  ),
);
api.post(
  "/notifications/read",
  run(async (req, res) => {
    await pool.query("UPDATE notifications SET is_read=true WHERE user_id=$1", [
      req.actor.id,
    ]);
    res.json({ ok: true });
  }),
);
api.post(
  "/devices",
  roles("picker"),
  run(async (req, res) => {
    const { token } = z
      .object({ token: z.string().min(20).max(4096) })
      .parse(req.body);
    await pool.query(
      "INSERT INTO device_tokens(token,user_id) VALUES($1,$2) ON CONFLICT(token) DO UPDATE SET user_id=$2,updated_at=now()",
      [token, req.actor.id],
    );
    res.json({ ok: true, pushConfigured });
  }),
);
api.delete(
  "/devices",
  run(async (req, res) => {
    const { token } = z
      .object({ token: z.string().min(20).max(4096) })
      .parse(req.body);
    await pool.query(
      "DELETE FROM device_tokens WHERE token=$1 AND user_id=$2",
      [token, req.actor.id],
    );
    res.json({ ok: true });
  }),
);
api.get(
  "/admin/pickers",
  roles("admin"),
  run(async (_req, res) =>
    res.json(
      (
        await pool.query(
          "SELECT u.id,u.name,u.phone,u.email,u.active,COUNT(p.id) FILTER(WHERE p.status IN ('assigned','in_progress','review_required'))::int active_jobs FROM users u LEFT JOIN pickups p ON p.picker_id=u.id WHERE u.role='picker' GROUP BY u.id ORDER BY u.name",
        )
      ).rows,
    ),
  ),
);
api.post(
  "/admin/pickers",
  roles("admin"),
  run(async (req, res) => {
    const d = person.parse(req.body);
    const hash = await bcrypt.hash(d.password, 12);
    const {
      rows: [u],
    } = await pool.query(
      "INSERT INTO users(id,name,phone,email,password_hash,role) VALUES($1,$2,$3,$4,$5,'picker') RETURNING *",
      [randomUUID(), d.name, d.phone, d.email || null, hash],
    );
    res.status(201).json(publicUser(u));
  }),
);
api.get(
  "/admin/analytics",
  roles("admin"),
  run(async (req, res) => {
    const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
    const q = z
      .object({ from: date.optional(), to: date.optional() })
      .parse(req.query);
    if (q.from && q.to)
      requireCondition(
        q.from <= q.to,
        400,
        "Start date must be before end date.",
      );
    const args = [q.from || null, q.to || null];
    const filter =
      "($1::date IS NULL OR p.created_at >= $1::date) AND ($2::date IS NULL OR p.created_at < $2::date + INTERVAL '1 day')";
    const [totals, materials, pickers] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::int requests,COUNT(*) FILTER(WHERE status='pending')::int pending,COUNT(*) FILTER(WHERE status IN ('assigned','in_progress'))::int active,COUNT(*) FILTER(WHERE status='review_required')::int review,COUNT(*) FILTER(WHERE status='completed')::int completed,COALESCE(SUM(earned_points),0)::float points FROM pickups p WHERE ${filter}`,
        args,
      ),
      pool.query(
        `SELECT m.category,m.name,COALESCE(SUM(i.actual_weight) FILTER(WHERE p.status='completed' AND ${filter}),0)::float weight FROM materials m LEFT JOIN pickup_items i USING(category) LEFT JOIN pickups p ON p.id=i.pickup_id GROUP BY m.category ORDER BY m.name`,
        args,
      ),
      pool.query(
        `SELECT u.id,u.name,COUNT(p.id) FILTER(WHERE p.status='completed')::int completed,COALESCE(SUM(p.earned_points),0)::float points FROM users u LEFT JOIN pickups p ON p.picker_id=u.id AND ${filter} WHERE u.role='picker' GROUP BY u.id ORDER BY completed DESC`,
        args,
      ),
    ]);
    res.json({
      ...totals.rows[0],
      weight: materials.rows.reduce((s, m) => s + m.weight, 0),
      materials: materials.rows,
      pickers: pickers.rows,
      telecomEnabled: false,
    });
  }),
);
api.use((_req, _res, next) => next(new HttpError(404, "Endpoint not found.")));
