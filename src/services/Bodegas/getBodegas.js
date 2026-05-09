import { apiFetch } from "../../utils/apiFetch";

export const getBodegas = async () => {
  const url = "https://inventarioapi-the3.onrender.com/api/Bodegas";
  const resp = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(resp) ? resp : [];

  return data.map((b) => ({
    id: b.id,
    nombre: b.nombre ?? "",
  }));
};