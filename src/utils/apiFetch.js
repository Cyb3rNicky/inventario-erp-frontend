import { getAuth } from "./auth";

export async function apiFetch(url, options = {}) {
  const auth = getAuth();
  const token = auth?.token;

  const isDummy = token === "DEV_DUMMY_TOKEN";

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(!token || isDummy ? {} : { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const resp = await fetch(url, { ...options, headers });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      msg += ` - ${await resp.text()}`;
    } catch {}
    throw new Error(msg);
  }

  const ct = resp.headers.get("content-type") || "";
  const text = await resp.text();

  if (ct.includes("application/json")) {
    return text ? JSON.parse(text) : null;
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}