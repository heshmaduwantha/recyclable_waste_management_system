import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { pool, migrate, transaction } from "./config/db";
async function seed() {
  const password = process.env.DEMO_PASSWORD;
  if (!password)
    throw new Error("Set DEMO_PASSWORD to seed local demo accounts.");
  await migrate();
  const hash = await bcrypt.hash(password, 12);
  await transaction(async (c) => {
    for (const [name, phone, email, role] of [
      ["EcoCollect Admin", "+94770000001", "admin@ecocollect.lk", "admin"],
      ["Nimal Perera", "+94770000002", "customer@ecocollect.lk", "customer"],
      ["Kamal Silva", "+94770000003", "picker@ecocollect.lk", "picker"],
    ]) {
      const { rows } = await c.query(
        "INSERT INTO users(id,name,phone,email,password_hash,role,address,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6,$7,6.9271,79.8612) ON CONFLICT(phone) DO UPDATE SET phone=EXCLUDED.phone RETURNING id",
        [
          randomUUID(),
          name,
          phone,
          email,
          hash,
          role,
          "Colombo Municipal Council, Town Hall, Colombo",
        ],
      );
      if (role === "customer")
        await c.query(
          "INSERT INTO wallets(user_id) VALUES($1) ON CONFLICT DO NOTHING",
          [rows[0].id],
        );
    }
    if (
      Number((await c.query("SELECT count(*) FROM badges")).rows[0].count) === 0
    ) {
      for (const [name, criterion, threshold, description] of [
        [
          "First collection",
          "collections",
          1,
          "Complete your first recyclable collection.",
        ],
        [
          "Ten kilos recycled",
          "weight",
          10,
          "Contribute 10 kg of recyclable materials.",
        ],
        [
          "Material explorer",
          "diversity",
          4,
          "Recycle all four material categories.",
        ],
      ])
        await c.query(
          "INSERT INTO badges(id,name,criterion,threshold,description) VALUES($1,$2,$3,$4,$5)",
          [randomUUID(), name, criterion, threshold, description],
        );
    }
  });
  console.log(
    "Local demo accounts seeded. Password is read from DEMO_PASSWORD.",
  );
}
seed().finally(() => pool.end());
