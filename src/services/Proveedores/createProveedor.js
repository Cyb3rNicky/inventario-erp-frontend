import { apiFetch } from "../../utils/apiFetch";

export const createProveedor = async (form) => {
  const url = "https://inventarioapi-the3.onrender.com/api/Proveedores";

  const payload = {
    nombre: String(form.nombre ?? "").trim(),
    categoriaId: Number(form.categoriaId),
    telefono: String(form.telefono ?? "").trim(),
    email: String(form.email ?? "").trim(),
    direccion: String(form.direccion ?? "").trim(),
    estado: Boolean(form.estado),
    timestamp: form.timestamp || new Date().toISOString(),
  };

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
