import { useEffect, useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { User, Pickup, Wallet, Badge } from "../../../shared/contracts";
import { api } from "../api";
import { Field, Modal, Status, Empty, date, num } from "../components/UI";
import { PickupDetails } from "../components/PickupDetails";
export function Customer({
  tab,
  user,
  pickups,
  refresh,
  updateUser,
  revision,
}: {
  tab: string;
  user: User;
  pickups: Pickup[];
  refresh: () => Promise<void>;
  updateUser: (u: User) => void;
  revision: number;
}) {
  const [wallet, W] = useState<Wallet | null>(null),
    [badges, B] = useState<Badge[]>([]),
    [selected, P] = useState<Pickup | null>(null),
    [create, C] = useState(false),
    [error, E] = useState(""),
    [busy, U] = useState(false),
    [message, S] = useState("");
  const [coords, G] = useState({
    latitude: user.latitude,
    longitude: user.longitude,
  });
  useEffect(() => {
    Promise.all([api("/wallet"), api("/badges")])
      .then(([w, b]) => {
        W(w);
        B(b);
      })
      .catch((e) => E(e.message));
  }, [revision]);
  function locate() {
    E("");
    navigator.geolocation.getCurrentPosition(
      (p) => G({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => E("Allow location access and try again."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>, profile = false) {
    e.preventDefault();
    U(true);
    E("");
    S("");
    const f = new FormData(e.currentTarget);
    try {
      if (coords.latitude === null || coords.longitude === null)
        throw new Error("Capture the collection location first.");
      if (profile) {
        const u = await api(
          "/me",
          { name: f.get("name"), address: f.get("address"), ...coords },
          "PUT",
        );
        updateUser(u);
        S("Profile updated.");
      } else {
        const items = ["plastic", "glass", "polythene", "metal"]
          .filter((c) => Number(f.get(c)) > 0)
          .map((category) => ({
            category,
            estimated_weight: Number(f.get(category)),
          }));
        if (!items.length)
          throw new Error(
            "Enter an estimated weight for at least one material.",
          );
        await api("/pickups", {
          address: f.get("address"),
          notes: f.get("notes"),
          ...coords,
          items,
        });
        C(false);
        S("Pickup request submitted.");
        await refresh();
      }
    } catch (e: any) {
      E(e.message);
    } finally {
      U(false);
    }
  }
  const list = tab === "Home" ? pickups.slice(0, 5) : pickups;
  return (
    <>
      {error && !create && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="success" role="status">
          {message}
        </p>
      )}
      {tab === "Home" && (
        <>
          <div className="customer-stats">
            <div>
              <span>Points balance</span>
              <strong>{num(wallet?.balance)}</strong>
            </div>
            <div>
              <span>Total weight</span>
              <strong>{num(wallet?.weight)} kg</strong>
            </div>
          </div>
          <button
            className="pickup-cta"
            onClick={() => {
              C(true);
              E("");
            }}
          >
            <Plus size={22} /> Request a pickup <ArrowUpRight size={22} />
          </button>
          <h2>Recent pickups</h2>
        </>
      )}
      {["Home", "History"].includes(tab) && (
        <section className="panel">
          {list.length ? (
            list.map((p) => (
              <button className="pickup-row" key={p.id} onClick={() => P(p)}>
                <div>
                  <strong>{date(p.created_at)}</strong>
                  <small>
                    {p.items
                      .map(
                        (i) => `${i.category} · ${num(i.estimated_weight)} kg`,
                      )
                      .join(", ")}
                  </small>
                  <small>{p.address}</small>
                </div>
                <Status value={p.status} />
              </button>
            ))
          ) : (
            <Empty>
              No collections yet. Request your first pickup from Home.
            </Empty>
          )}
        </section>
      )}
      {tab === "Wallet" && (
        <>
          <div className="wallet-hero">
            <p>Your eco-points</p>
            <h2>{num(wallet?.balance)}</h2>
            <span>
              {wallet?.collections || 0} collections · {num(wallet?.weight)} kg
              recycled
            </span>
          </div>
          <section className="panel">
            <h2>Transaction history</h2>
            {wallet?.transactions.length ? (
              wallet.transactions.map((t) => (
                <div className="list-row" key={t.id}>
                  <div>
                    <strong>Collection reward</strong>
                    <small>{date(t.created_at)}</small>
                    <small>
                      {t.items
                        .map(
                          (i) =>
                            `${i.category}: ${i.actual_weight} kg × ${i.rate_snapshot}`,
                        )
                        .join(" · ")}
                    </small>
                  </div>
                  <strong className="green">+{num(t.points)}</strong>
                </div>
              ))
            ) : (
              <Empty>Points appear after a verified collection.</Empty>
            )}
          </section>
        </>
      )}
      {tab === "Profile" && (
        <div className="split">
          <section className="panel">
            <h2>Your details</h2>
            <form onSubmit={(e) => submit(e, true)}>
              <Field label="Full name">
                <input
                  name="name"
                  defaultValue={user.name}
                  required
                  minLength={2}
                />
              </Field>
              <Field label="Phone">
                <input value={user.phone} disabled />
              </Field>
              <Field label="Collection address">
                <textarea
                  name="address"
                  defaultValue={user.address}
                  required
                  minLength={5}
                />
              </Field>
              <button type="button" className="secondary" onClick={locate}>
                Update current location
              </button>
              <p className="muted">
                {coords.latitude?.toFixed(5)}, {coords.longitude?.toFixed(5)}
              </p>
              <button disabled={busy}>Save profile</button>
            </form>
          </section>
          <section className="panel">
            <h2>Your badges</h2>
            {badges.map((b) => (
              <div
                className={"badge-row " + (!b.awarded_at ? "locked" : "")}
                key={b.id}
              >
                <span className="badge-icon">♧</span>
                <div>
                  <strong>{b.name}</strong>
                  <p>{b.description}</p>
                  <small>
                    {b.awarded_at
                      ? "Awarded " + date(b.awarded_at)
                      : "Not earned yet"}
                  </small>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      {create && (
        <Modal title="Request a pickup" close={() => C(false)}>
          <p className="muted">
            Enter approximate weights. Your picker verifies them at collection.
          </p>
          <form onSubmit={(e) => submit(e)}>
            <div className="form-grid">
              {["plastic", "glass", "polythene", "metal"].map((c) => (
                <Field
                  key={c}
                  label={c.charAt(0).toUpperCase() + c.slice(1) + " (kg)"}
                >
                  <input
                    name={c}
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    placeholder="0"
                  />
                </Field>
              ))}
            </div>
            <Field label="Collection address">
              <textarea
                name="address"
                defaultValue={user.address}
                required
                minLength={5}
              />
            </Field>
            <button type="button" className="secondary" onClick={locate}>
              Use current location
            </button>
            <p className="muted">
              {coords.latitude?.toFixed(5)}, {coords.longitude?.toFixed(5)} ·
              Confirm this is the pickup location.
            </p>
            <Field label="Notes (optional)">
              <textarea
                name="notes"
                maxLength={500}
                placeholder="Gate number or access instructions"
              />
            </Field>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="wide" disabled={busy}>
              {busy ? "Submitting…" : "Submit request"}
            </button>
          </form>
        </Modal>
      )}
      {selected && (
        <PickupDetails
          p={selected}
          user={user}
          close={() => P(null)}
          refresh={refresh}
        />
      )}
    </>
  );
}
