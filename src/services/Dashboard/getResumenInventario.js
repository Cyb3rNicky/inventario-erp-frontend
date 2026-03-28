import { apiFetch } from "../../utils/apiFetch";

export const getResumenInventario = async (params = {}) => {
  const base = "https://inventarioapi-the3.onrender.com/api/Productos/resumen";

  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.categoria) qs.set("categoria", params.categoria);
  if (params.ubicacion) qs.set("ubicacion", params.ubicacion);
  if (typeof params.soloBajoStock === "boolean") {
    qs.set("soloBajoStock", String(params.soloBajoStock));
  }

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;

  const resp = await apiFetch(url, { method: "GET" });

  return {
    totalProductos: resp?.totalProductos ?? 0,
    unidadesTotales: resp?.unidadesTotales ?? 0,
    productosBajoStock: resp?.productosBajoStock ?? 0,
    valorInventarioCosto: resp?.valorInventarioCosto ?? 0,
    valorInventarioVenta: resp?.valorInventarioVenta ?? 0,
    generatedAt: resp?.generatedAt ?? "",
  };
};