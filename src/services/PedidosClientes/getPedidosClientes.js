import { apiFetch } from "../../utils/apiFetch";

export const getPedidosClientes = async (estado = "") => {
  const base = "https://inventarioapi-the3.onrender.com/api/PedidosClientes";

  const qs = new URLSearchParams();
  if (estado?.trim()) qs.set("estado", estado.trim());

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;

  const resp = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    id: p.id,
    clienteId: p.clienteId ?? 0,
    estado: p.estado ?? "",
    timestamp: p.timestamp ?? "",
    totalVenta: p.totalVenta ?? 0,
    detalles: Array.isArray(p.detalles)
      ? p.detalles.map((d) => ({
          id: d.id,
          productoId: d.productoId ?? 0,
          nombreProducto: d.nombreProducto ?? "",
          cantidad: d.cantidad ?? 0,
          precioUnitario: d.precioUnitario ?? 0,
          subtotal: d.subtotal ?? 0,
          timestamp: d.timestamp ?? "",
        }))
      : [],
  }));
};