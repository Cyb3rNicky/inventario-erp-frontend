const KEY = "auth";

export function setAuth({ token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

// Solo verifica si hay token, sin roles
export function isLogged() {
  const a = getAuth();
  return !!a?.token;
}

// Mantener roles para admin
export function isAdmin() {
  const a = getAuth();
  return a?.user?.roles?.includes("admin") || false;
}
