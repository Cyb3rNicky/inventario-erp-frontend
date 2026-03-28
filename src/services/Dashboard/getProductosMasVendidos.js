import { apiFetch } from "../../utils/apiFetch";

export const getProductosMasVendidos = async (params = {}) => {
  const base = "https://inventarioapi-the3.onrender.com/api/Productos/mas-vendidos";

  const qs = new URLSearchParams();
  if (params.top) qs.set("top", String(params.top));
  if (params.desde) qs.set("desde", params.desde);
  if (params.hasta) qs.set("hasta", params.hasta);

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;

  const resp = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    productoId: p.productoId,
    nombre: p.nombre ?? "",
    codigo: p.codigo ?? "",
    categoria: p.categoria ?? "",
    cantidadVendida: p.cantidadVendida ?? 0,
    ingresoTotal: p.ingresoTotal ?? 0,
    totalPedidos: p.totalPedidos ?? 0,
  }));
};