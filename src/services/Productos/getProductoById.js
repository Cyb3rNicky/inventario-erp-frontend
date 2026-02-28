import { apiFetch } from "../../utils/apiFetch";

export const getProductoById = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Productos/${id}`;
  const json = await apiFetch(url, { method: "GET" });

  const p = json?.data ?? json;

  return {
    id:            p.id,
    nombre:        p.nombre ?? "",
    codigo:        p.codigo ?? "",
    categoria:     p.categoria ?? "",
    ubicacion:     p.ubicacion ?? "",
    descripcion:   p.descripcion ?? "",
    precioVenta:   p.precioVenta ?? 0,
    costoUnitario: p.costoUnitario ?? 0,
    stockActual:   p.stockActual ?? 0,
    stockMinimo:   p.stockMinimo ?? 0,
    estado:        p.estado ?? true,
    creadoPorId:   p.creadoPorId ?? 0,
    timestamp:     p.timestamp ?? "",
    // extras (solo lectura)
    stockBajo:       p.stockBajo,
    nivelInventario: p.nivelInventario,
  };
};