import { apiFetch } from "../../utils/apiFetch";

export const getProductosRotacion = async () => {
  const url = "https://inventarioapi-the3.onrender.com/api/Productos/rotacion";

  const resp = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    productoId: p.productoId,
    nombre: p.nombre ?? "",
    codigo: p.codigo ?? "",
    categoria: p.categoria ?? "",
    bodega: p.bodega ?? "",
    cantidadVendida: p.cantidadVendida ?? 0,
    totalPedidos: p.totalPedidos ?? 0,
    ingresoTotal: p.ingresoTotal ?? 0,
    indiceRotacion: p.indiceRotacion ?? 0,
    nivelRotacion: p.nivelRotacion ?? "",
    diasPromedioInventario: p.diasPromedioInventario ?? 0,
  }));
};