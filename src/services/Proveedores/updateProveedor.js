import { apiFetch } from "../../utils/apiFetch";

export const updateProveedor = async (form) => {
  const id = Number(form.id);
  const url = `https://inventarioapi-the3.onrender.com/api/Proveedores/${id}`;

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
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
