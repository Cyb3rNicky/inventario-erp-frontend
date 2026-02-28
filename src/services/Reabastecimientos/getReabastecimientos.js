import { apiFetch } from "../../utils/apiFetch";

export const getReabastecimientos = async () => {
  const url = "https://inventarioapi-the3.onrender.com/api/Reabastecimientos";
  const resp = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(resp) ? resp : [];

  return data.map((r) => ({
    id: r.id,
    productoId: r.productoId,
    codigoProducto: r.codigoProducto ?? "",
    nombreProducto: r.nombreProducto ?? "",
    cantidadSugerida: r.cantidadSugerida ?? 0,
    proveedorSugeridoId: r.proveedorSugeridoId ?? 0,
    estado: r.estado ?? "",
    timestamp: r.timestamp ?? "",
    ordenCompraId: r.ordenCompraId ?? 0,
  }));
};