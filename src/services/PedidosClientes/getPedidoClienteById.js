import { apiFetch } from "../../utils/apiFetch";

export const getPedidoClienteById = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/PedidosClientes/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const p = json?.data ?? json;

  return {
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
  };
};