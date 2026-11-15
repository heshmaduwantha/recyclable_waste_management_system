import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { api } from "../api";
import { num, Empty } from "../components/UI";
export function Metrics({ data }: { data: any }) {
  return (
    <div className="metrics">
      {[
        ["Pending", data.pending],
        ["Active", data.active],
        ["Completed", data.completed],
        ["Collected", num(data.weight) + " kg"],
      ].map(([label, value]) => (
        <div key={label} className="metric">
          <span>{label}</span>
          <strong>{value ?? 0}</strong>
        </div>
      ))}
    </div>
  );
}
export function Overview({ revision }: { revision: number }) {
  const [data, S] = useState<any>(null),
    [from, F] = useState(""),
    [to, T] = useState(""),
    [error, E] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let alive = true;
    api(
      "/admin/analytics?" +
        new URLSearchParams({
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        }),
    )
      .then((d) => {
        if (alive) {
          S(d);
          E("");
        }
      })
      .catch((e) => {
        if (alive) E(e.message);
      });
    return () => {
      alive = false;
    };
  }, [revision, from, to]);
  useEffect(() => {
    if (!data || !canvas.current) return;
    const c = new Chart(canvas.current, {
      type: "bar",
      data: {
        labels: data.materials.map((m: any) => m.name),
        datasets: [
          {
            label: "Collected weight (kg)",
            data: data.materials.map((m: any) => m.weight),
            backgroundColor: "#16845b",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
    return () => c.destroy();
  }, [data]);
  return (
    <>
      <div className="filters">
        <label>
          From
          <input type="date" value={from} onChange={(e) => F(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => T(e.target.value)} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <Metrics data={data} />
          <div className="split">
            <section className="panel">
              <h2>Collected by material</h2>
              <div className="chart">
                <canvas ref={canvas} />
              </div>
            </section>
            <section className="panel">
              <h2>Collection impact</h2>
              <p className="big-number">{num(data.points)}</p>
              <p className="muted">Eco-points issued</p>
              <p>
                <strong>{data.review}</strong> collections awaiting GPS review
              </p>
              <p>
                <strong>{data.requests}</strong> total requests in this period
              </p>
            </section>
          </div>
          <section className="panel">
            <h2>Picker performance</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Picker</th>
                    <th>Completed collections</th>
                    <th>Points generated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pickers.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.completed}</td>
                      <td>{num(p.points)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.pickers.length && <Empty>No pickers yet.</Empty>}
          </section>
        </>
      )}
    </>
  );
}
