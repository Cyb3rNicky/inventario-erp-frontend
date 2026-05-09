import { apiFetch } from "../../utils/apiFetch";

export const getCategorias = async () => {
  const url = "https://inventarioapi-the3.onrender.com/api/Categorias";
  const resp = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(resp) ? resp : [];

  return data.map((c) => ({
    id: c.id,
    nombre: c.nombre ?? "",
  }));
};