const base = import.meta.env.VITE_API_URL || "/api/v1";
let token = sessionStorage.getItem("eco-token") || "";
export const setToken = (t: string) => {
  token = t;
  t
    ? sessionStorage.setItem("eco-token", t)
    : sessionStorage.removeItem("eco-token");
};
export async function api<T = any>(
  path: string,
  body?: unknown,
  method = body ? "POST" : "GET",
): Promise<T> {
  const form = body instanceof FormData;
  const r = await fetch(base + path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!form && body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const d = await r.json();
  if (!r.ok) {
    if (r.status === 401) window.dispatchEvent(new Event("session-expired"));
    throw new Error(d.error || "Request failed.");
  }
  return d;
}
export async function photoUrl(id: string) {
  const r = await fetch(base + "/evidence/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error("Photo unavailable.");
  return URL.createObjectURL(await r.blob());
}
