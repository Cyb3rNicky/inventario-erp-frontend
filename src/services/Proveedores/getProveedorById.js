import { apiFetch } from "../../utils/apiFetch";

export const getProveedorById = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Proveedores/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const p = json?.data ?? json;

  return {
    id: p.id,
    nombre: p.nombre ?? "",
    categoriaId: p.categoriaId ?? "",
    categoria: p.categoria ?? "",
    telefono: p.telefono ?? "",
    email: p.email ?? "",
    direccion: p.direccion ?? "",
    estado: p.estado ?? true,
    timestamp: p.timestamp ?? "",
  };
};