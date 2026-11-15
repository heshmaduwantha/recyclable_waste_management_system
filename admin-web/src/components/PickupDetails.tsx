import { useEffect, useState } from "react";
import { Pickup, User } from "../../../shared/contracts";
import { api, photoUrl } from "../api";
import { Modal, Status, num, date, Field } from "./UI";
function Photo({ id }: { id: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let u = "",
      alive = true;
    photoUrl(id)
      .then((v) => {
        u = v;
        if (alive) setUrl(v);
        else URL.revokeObjectURL(v);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [id]);
  return url ? (
    <a href={url} target="_blank" rel="noreferrer">
      <img className="evidence" alt="Collection evidence" src={url} />
    </a>
  ) : (
    <span>Loading photo…</span>
  );
}
export function PickupDetails({
  p,
  user,
  pickers = [],
  close,
  refresh,
}: {
  p: Pickup;
  user: User;
  pickers?: any[];
  close: () => void;
  refresh: () => Promise<void>;
}) {
  const [picker, setPicker] = useState(p.picker_id || ""),
    [note, setNote] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function action(path: string, body?: unknown) {
    setBusy(true);
    setError("");
    try {
      await api(path, body || {});
      await refresh();
      close();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Collection details" close={close}>
      <Status value={p.status} />
      <p className="muted">
        {date(p.created_at)} · #{p.id.slice(0, 8)}
      </p>
      <h3>{p.customer_name}</h3>
      <p>{p.address}</p>
      <p className="muted">
        {p.customer_phone} · Picker: {p.picker_name || "Not assigned"}
      </p>
      {p.notes && <p>{p.notes}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Estimated</th>
              <th>Verified</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((i) => (
              <tr key={i.category}>
                <td className="capitalize">{i.category}</td>
                <td>{num(i.estimated_weight)} kg</td>
                <td>
                  {i.actual_weight === null
                    ? "—"
                    : num(i.actual_weight) + " kg"}
                </td>
                <td>{i.points === null ? "—" : num(i.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {p.status === "completed" && (
        <p className="success">{num(p.earned_points)} eco-points credited</p>
      )}
      {p.review_reason && <p className="warning">{p.review_reason}</p>}
      {p.review_note && <p>Review: {p.review_note}</p>}
      <div className="photos">
        {p.evidence.map((e) => (
          <Photo key={e.id} id={e.id} />
        ))}
      </div>
      {user.role === "admin" && ["pending", "assigned"].includes(p.status) && (
        <div className="action-block">
          <Field label="Assign picker">
            <select value={picker} onChange={(e) => setPicker(e.target.value)}>
              <option value="">Choose a picker</option>
              {pickers.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} · {k.active_jobs} active jobs
                </option>
              ))}
            </select>
          </Field>
          <button
            disabled={!picker || busy}
            onClick={() =>
              action(`/admin/pickups/${p.id}/assign`, { picker_id: picker })
            }
          >
            Assign collection
          </button>
        </div>
      )}
      {user.role === "admin" && p.status === "review_required" && (
        <div className="action-block">
          <Field label="Review note">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              minLength={5}
              placeholder="Explain the review decision"
            />
          </Field>
          <div className="actions">
            <button
              disabled={busy || note.trim().length < 5}
              onClick={() =>
                action(`/admin/pickups/${p.id}/review`, { approve: true, note })
              }
            >
              Approve & credit points
            </button>
            <button
              className="secondary"
              disabled={busy || note.trim().length < 5}
              onClick={() =>
                action(`/admin/pickups/${p.id}/review`, {
                  approve: false,
                  note,
                })
              }
            >
              Return for correction
            </button>
          </div>
        </div>
      )}
      {user.role === "customer" && p.status === "pending" && (
        <button
          className="secondary"
          disabled={busy}
          onClick={() => action(`/pickups/${p.id}/cancel`)}
        >
          Cancel request
        </button>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
