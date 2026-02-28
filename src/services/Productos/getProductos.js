import { apiFetch } from "../../utils/apiFetch";

export const getProductos = async (params = {}) => {
  const base = "https://inventarioapi-the3.onrender.com/api/Productos";

  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.categoria) qs.set("categoria", params.categoria);
  if (params.ubicacion) qs.set("ubicacion", params.ubicacion);
  if (typeof params.soloBajoStock === "boolean") qs.set("soloBajoStock", String(params.soloBajoStock));

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;

  const resp = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    id:              p.id,
    nombre:          p.nombre,
    codigo:          p.codigo,
    categoria:       p.categoria,
    ubicacion:       p.ubicacion,
    descripcion:     p.descripcion,
    precioVenta:     p.precioVenta,
    costoUnitario:   p.costoUnitario,
    stockActual:     p.stockActual,
    stockMinimo:     p.stockMinimo,
    stockBajo:       p.stockBajo,
    nivelInventario: p.nivelInventario,
    estado:          p.estado,
    timestamp:       p.timestamp,
  }));
};