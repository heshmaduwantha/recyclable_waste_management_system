import { useEffect, useState } from "react";
import { api } from "../api";
import { Field, num } from "../components/UI";
import { Material, Badge } from "../../../shared/contracts";
export function Manage({
  tab,
  pickers,
  refresh,
}: {
  tab: string;
  pickers: any[];
  refresh: () => Promise<void>;
}) {
  const [materials, M] = useState<Material[]>([]),
    [badges, B] = useState<Badge[]>([]),
    [radius, R] = useState("150"),
    [message, S] = useState(""),
    [error, E] = useState(""),
    [busy, U] = useState(false);
  async function load() {
    const [m, b, c] = await Promise.all([
      api("/materials"),
      api("/badges"),
      api("/config"),
    ]);
    M(m);
    B(b);
    R(String(c.gpsRadiusMeters));
  }
  useEffect(() => {
    load().catch((e) => E(e.message));
  }, []);
  async function save(path: string, body: any, method = "POST") {
    U(true);
    E("");
    S("");
    try {
      await api(path, body, method);
      S("Saved successfully.");
      await Promise.all([refresh(), load()]);
    } catch (e: any) {
      E(e.message);
    } finally {
      U(false);
    }
  }
  function submit(e: React.FormEvent<HTMLFormElement>, kind: string) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    save(
      "/admin/" + kind,
      kind === "badges" ? { ...f, threshold: Number(f.threshold) } : f,
    );
  }
  return (
    <>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="success" role="status">
          {message}
        </p>
      )}
      {tab === "Pickers" && (
        <div className="split">
          <section className="panel">
            <h2>Collection team</h2>
            {pickers.map((p) => (
              <div className="list-row" key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.phone}</small>
                </div>
                <span>{p.active_jobs} active jobs</span>
              </div>
            ))}
          </section>
          <section className="panel">
            <h2>Add a picker</h2>
            <form onSubmit={(e) => submit(e, "pickers")}>
              <Field label="Full name">
                <input name="name" minLength={2} required />
              </Field>
              <Field label="Mobile">
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="0771234567"
                />
              </Field>
              <Field label="Email (optional)">
                <input name="email" type="email" />
              </Field>
              <Field label="Initial password">
                <input name="password" type="password" minLength={8} required />
              </Field>
              <button disabled={busy}>Create picker</button>
            </form>
          </section>
        </div>
      )}
      {tab === "Rates" && (
        <>
          <section className="panel">
            <h2>Material reward rates</h2>
            <p className="muted">
              New rates apply when a collection is submitted for completion.
              Completed collections keep their original rate.
            </p>
            {materials.map((m) => (
              <form
                className="rate-row"
                key={m.category}
                onSubmit={(e) => {
                  e.preventDefault();
                  save(
                    "/admin/materials/" + m.category,
                    {
                      points_per_kg: Number(
                        new FormData(e.currentTarget).get("rate"),
                      ),
                    },
                    "PUT",
                  );
                }}
              >
                <strong>{m.name}</strong>
                <Field label="Points per kg">
                  <input
                    key={m.points_per_kg}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100000"
                    name="rate"
                    defaultValue={m.points_per_kg}
                    required
                  />
                </Field>
                <button disabled={busy}>Save rate</button>
              </form>
            ))}
          </section>
          <section className="panel">
            <h2>GPS verification</h2>
            <form
              className="rate-row"
              onSubmit={(e) => {
                e.preventDefault();
                save(
                  "/admin/settings",
                  { gpsRadiusMeters: Number(radius) },
                  "PUT",
                );
              }}
            >
              <Field label="Allowed radius (metres)">
                <input
                  type="number"
                  min="25"
                  max="5000"
                  value={radius}
                  onChange={(e) => R(e.target.value)}
                  required
                />
              </Field>
              <button disabled={busy}>Save radius</button>
            </form>
          </section>
        </>
      )}
      {tab === "Badges" && (
        <div className="split">
          <section className="panel">
            <h2>Recognition milestones</h2>
            <p className="muted">
              Badges recognise contribution and have no monetary value or
              multiplier.
            </p>
            {badges.map((b) => (
              <div className="badge-row" key={b.id}>
                <span className="badge-icon">♧</span>
                <div>
                  <strong>{b.name}</strong>
                  <p>{b.description}</p>
                  <small>
                    {num(b.threshold)} {b.criterion}
                  </small>
                </div>
              </div>
            ))}
          </section>
          <section className="panel">
            <h2>Add a milestone</h2>
            <form onSubmit={(e) => submit(e, "badges")}>
              <Field label="Badge name">
                <input name="name" required minLength={2} />
              </Field>
              <Field label="Criterion">
                <select name="criterion">
                  <option value="weight">Total weight (kg)</option>
                  <option value="collections">Completed collections</option>
                  <option value="diversity">Material categories</option>
                </select>
              </Field>
              <Field label="Threshold">
                <input
                  name="threshold"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                />
              </Field>
              <Field label="Description">
                <textarea name="description" required minLength={5} />
              </Field>
              <button disabled={busy}>Create badge</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
