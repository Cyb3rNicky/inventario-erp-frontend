import { apiFetch } from "../../utils/apiFetch";

export const getProductoById = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Productos/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const p = json?.data ?? json;

  return {
    id: p.id,
    nombre: p.nombre ?? "",
    codigo: p.codigo ?? "",

    categoriaId: p.categoriaId ?? "",
    categoria: p.categoria ?? "",

    bodegaId: p.bodegaId ?? "",
    bodegaNombre: p.bodegaNombre ?? "",

    descripcion: p.descripcion ?? "",
    precioVenta: p.precioVenta ?? "",
    costoUnitario: p.costoUnitario ?? "",
    stockActual: p.stockActual ?? "",
    stockMinimo: p.stockMinimo ?? "",
    estado: p.estado ?? true,
    creadoPorId: p.creadoPorId ?? 0,
    timestamp: p.timestamp ?? "",
  };
};