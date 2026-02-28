export const login = async ({ userName, password }) => {
  const url = 'https://inventarioapi-the3.onrender.com/api/auth/login';

  const body = JSON.stringify({ UserName: userName, Password: password });

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  // { token, user: { id, userName, email, nombre, apellido, roles: [...] } }
  return resp.json();
};
