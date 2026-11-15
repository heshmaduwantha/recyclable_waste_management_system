import { useState } from "react";
import { Pickup, User, statusLabel } from "../../../shared/contracts";
import { Empty, Status, num, date } from "../components/UI";
import { PickupDetails } from "../components/PickupDetails";
export function Requests({
  pickups,
  user,
  pickers,
  refresh,
}: {
  pickups: Pickup[];
  user: User;
  pickers: any[];
  refresh: () => Promise<void>;
}) {
  const [status, S] = useState(""),
    [material, M] = useState(""),
    [day, D] = useState(""),
    [selected, P] = useState<Pickup | null>(null);
  const rows = pickups.filter(
    (p) =>
      (!status || p.status === status) &&
      (!material || p.items.some((i) => i.category === material)) &&
      (!day || new Date(p.created_at).toLocaleDateString("en-CA") === day),
  );
  return (
    <>
      <div className="filters">
        <label>
          Status
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => S(e.target.value)}
          >
            <option value="">All statuses</option>
            {[
              "pending",
              "assigned",
              "in_progress",
              "review_required",
              "completed",
              "cancelled",
            ].map((s) => (
              <option value={s} key={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={day} onChange={(e) => D(e.target.value)} />
        </label>
        <label>
          Material
          <select value={material} onChange={(e) => M(e.target.value)}>
            <option value="">All materials</option>
            {["plastic", "glass", "polythene", "metal"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Materials</th>
              <th>Status</th>
              <th>Picker</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.customer_name}</strong>
                  <small>{p.address}</small>
                  <small>{date(p.created_at)}</small>
                </td>
                <td>
                  {p.items.map((i) => (
                    <div className="capitalize" key={i.category}>
                      {i.category} · {num(i.estimated_weight)} kg
                    </div>
                  ))}
                </td>
                <td>
                  <Status value={p.status} />
                </td>
                <td>{p.picker_name || "—"}</td>
                <td>
                  <button
                    className={p.status === "pending" ? "" : "secondary"}
                    onClick={() => P(p)}
                  >
                    {p.status === "pending"
                      ? "Assign"
                      : p.status === "review_required"
                        ? "Review"
                        : "Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <Empty>No collections match these filters.</Empty>
        )}
      </section>
      {selected && (
        <PickupDetails
          p={selected}
          user={user}
          pickers={pickers}
          close={() => P(null)}
          refresh={refresh}
        />
      )}
    </>
  );
}
