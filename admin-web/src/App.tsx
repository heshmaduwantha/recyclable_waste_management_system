import { useCallback, useEffect, useState } from "react";
import {
  Recycle,
  LayoutDashboard,
  ClipboardList,
  Users,
  Coins,
  Award,
  Home,
  History,
  Wallet,
  UserRound,
  LogOut,
  RefreshCw,
  Bell,
} from "lucide-react";
import { User, Pickup, Notice } from "../../shared/contracts";
import { api, setToken } from "./api";
import { Auth } from "./pages/Auth";
import { Requests } from "./pages/Requests";
import { Overview, Metrics } from "./pages/Overview";
import { Manage } from "./pages/Manage";
import { Customer } from "./pages/Customer";
import { Modal, Empty, date } from "./components/UI";
import "./styles.css";
const icons: any = {
  Overview: LayoutDashboard,
  Requests: ClipboardList,
  Pickers: Users,
  Rates: Coins,
  Badges: Award,
  Home,
  History,
  Wallet,
  Profile: UserRound,
};
export default function App() {
  const [user, U] = useState<User | null>(null),
    [boot, B] = useState(true),
    [tab, T] = useState(""),
    [pickups, P] = useState<Pickup[]>([]),
    [pickers, K] = useState<any[]>([]),
    [stats, S] = useState<any>({}),
    [notices, N] = useState<Notice[]>([]),
    [showNotices, V] = useState(false),
    [error, E] = useState(""),
    [busy, Q] = useState(false),
    [revision, R] = useState(0);
  const logout = useCallback(() => {
    setToken("");
    U(null);
    P([]);
    N([]);
    T("");
    E("");
  }, []);
  useEffect(() => {
    api<User>("/me")
      .then((u) => {
        U(u);
        T(u.role === "admin" ? "Requests" : "Home");
      })
      .catch(() => setToken(""))
      .finally(() => B(false));
    window.addEventListener("session-expired", logout);
    return () => window.removeEventListener("session-expired", logout);
  }, [logout]);
  const refresh = useCallback(async () => {
    if (!user) return;
    Q(true);
    try {
      const [p, n, ...extra] = await Promise.all([
        api("/pickups"),
        api("/notifications"),
        ...(user.role === "admin"
          ? [api("/admin/pickers"), api("/admin/analytics")]
          : []),
      ]);
      P(p);
      N(n);
      if (extra.length) {
        K(extra[0]);
        S(extra[1]);
      }
      E("");
      R((v) => v + 1);
    } catch (e: any) {
      E(e.message);
      throw e;
    } finally {
      Q(false);
    }
  }, [user?.id]);
  useEffect(() => {
    if (!user) return;
    void refresh().catch(() => {});
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        void refresh().catch(() => {});
    }, 5000);
    return () => clearInterval(timer);
  }, [refresh, user?.id]);
  if (boot) return <div className="loading">Loading EcoCollect…</div>;
  if (!user)
    return (
      <Auth
        onLogin={(u) => {
          U(u);
          T(u.role === "admin" ? "Requests" : "Home");
        }}
      />
    );
  if (user.role === "picker")
    return (
      <main className="loading">
        <h1>Welcome, {user.name}</h1>
        <p>Use the mobile app for collection jobs, GPS and photo evidence.</p>
        <a href={`http://${window.location.hostname}:8081`}>
          Open mobile app preview
        </a>
        <button onClick={logout}>Sign out</button>
      </main>
    );
  const tabs =
    user.role === "admin"
      ? ["Overview", "Requests", "Pickers", "Rates", "Badges"]
      : ["Home", "History", "Wallet", "Profile"];
  const title =
    tab === "Requests"
      ? "Pickup requests"
      : tab === "Home"
        ? "Let's recycle"
        : tab === "Overview"
          ? "Collection overview"
          : tab === "Rates"
            ? "Reward rates"
            : tab;
  return (
    <div className={"app " + (user.role === "customer" ? "customer-app" : "")}>
      <aside>
        <div className="brand">
          <Recycle /> EcoCollect
        </div>
        <nav>
          {tabs.map((t) => {
            const Icon = icons[t];
            return (
              <button
                key={t}
                className={tab === t ? "selected" : ""}
                onClick={() => T(t)}
              >
                <Icon size={21} />
                <span>{t}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <small>{user.name}</small>
          <span className="capitalize">{user.role}</span>
          <button onClick={logout}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>
      <main className="content">
        <header>
          <div>
            <h1>{title}</h1>
            <p className="muted">
              {tab === "Requests"
                ? "Manage collections in one place."
                : user.role === "customer"
                  ? "A little recycling makes a real difference."
                  : "A clear view of your recycling operations."}
            </p>
          </div>
          <div className="actions">
            <button
              className="secondary notification-button"
              onClick={() => {
                V(true);
                api("/notifications/read", {})
                  .then(() => refresh())
                  .catch(() => {});
              }}
              aria-label="Notifications"
            >
              <Bell size={19} />
              {notices.some((n) => !n.is_read) && <i />}
            </button>
            <button
              className="secondary"
              disabled={busy}
              onClick={() => refresh().catch(() => {})}
            >
              <RefreshCw size={17} />
              <span>Refresh</span>
            </button>
          </div>
        </header>
        {error && (
          <p className="error" role="alert">
            {error}{" "}
            <button className="link" onClick={() => refresh().catch(() => {})}>
              Retry
            </button>
          </p>
        )}
        {user.role === "admin" ? (
          <>
            {tab === "Requests" && (
              <>
                <Metrics data={stats} />
                <Requests
                  pickups={pickups}
                  user={user}
                  pickers={pickers}
                  refresh={refresh}
                />
              </>
            )}
            {tab === "Overview" && <Overview revision={revision} />}{" "}
            {["Pickers", "Rates", "Badges"].includes(tab) && (
              <Manage tab={tab} pickers={pickers} refresh={refresh} />
            )}
          </>
        ) : (
          <Customer
            tab={tab}
            user={user}
            pickups={pickups}
            refresh={refresh}
            updateUser={U}
            revision={revision}
          />
        )}
      </main>
      {showNotices && (
        <Modal title="Notifications" close={() => V(false)}>
          {notices.length ? (
            notices.map((n) => (
              <div className="notice" key={n.id}>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{date(n.created_at)}</small>
              </div>
            ))
          ) : (
            <Empty>You are all caught up.</Empty>
          )}
        </Modal>
      )}
    </div>
  );
}
