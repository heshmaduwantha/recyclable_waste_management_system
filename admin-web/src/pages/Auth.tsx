import { useState } from "react";
import { Recycle } from "lucide-react";
import { api, setToken } from "../api";
import { Field } from "../components/UI";
import { User } from "../../../shared/contracts";
export function Auth({ onLogin }: { onLogin: (u: User) => void }) {
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (register && !coords)
        throw new Error("Capture your collection location first.");
      const r = await api(
        "/auth/" + (register ? "register" : "login"),
        register ? { ...f, ...coords } : f,
      );
      setToken(r.token);
      onLogin(r.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function locate() {
    setError("");
    navigator.geolocation.getCurrentPosition(
      (p) =>
        setCoords({
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        }),
      () =>
        setError(
          "Location access is required. Allow location permission and try again.",
        ),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }
  return (
    <main className="auth">
      <div className="auth-story">
        <div className="brand">
          <Recycle /> EcoCollect
        </div>
        <h1>
          A small step.
          <br />A cleaner tomorrow.
        </h1>
        <p>
          Request a collection. Recycle with confidence.
          <br />
          See the difference you make.
        </p>
        <div className="auth-line">Plastic · Glass · Polythene · Metal</div>
      </div>
      <section className="auth-form">
        <h2>{register ? "Create your account" : "Welcome back"}</h2>
        <p className="muted">
          {register
            ? "Start recycling from your doorstep."
            : "Sign in to your EcoCollect account."}
        </p>
        <form onSubmit={submit}>
          {register ? (
            <>
              <Field label="Full name">
                <input name="name" required minLength={2} />
              </Field>
              <Field label="Mobile number">
                <input
                  name="phone"
                  type="tel"
                  placeholder="0771234567"
                  required
                />
              </Field>
              <Field label="Email (optional)">
                <input name="email" type="email" />
              </Field>
              <Field label="Collection address">
                <textarea name="address" required minLength={5} />
              </Field>
              <button type="button" className="secondary" onClick={locate}>
                {coords ? "✓ Location captured" : "Use my current location"}
              </button>
            </>
          ) : (
            <Field label="Phone or email">
              <input name="identifier" autoComplete="username" required />
            </Field>
          )}
          <Field label="Password">
            <input
              name="password"
              type="password"
              minLength={8}
              maxLength={128}
              autoComplete={register ? "new-password" : "current-password"}
              required
            />
          </Field>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary wide" disabled={busy}>
            {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
          </button>
        </form>
        <button
          className="link"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Already have an account? Sign in"
            : "New here? Create a customer account"}
        </button>
      </section>
    </main>
  );
}
