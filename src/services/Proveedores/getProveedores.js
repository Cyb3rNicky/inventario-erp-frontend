import { apiFetch } from "../../utils/apiFetch";

export const getProveedores = async () => {
  const url = "https://inventarioapi-the3.onrender.com/api/Proveedores";
  const resp = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    id: p.id,
    nombre: p.nombre ?? "",
    telefono: p.telefono ?? "",
    email: p.email ?? "",
    direccion: p.direccion ?? "",
    estado: p.estado ?? true,
    timestamp: p.timestamp ?? "",
  }));
};