import { apiFetch } from "../../utils/apiFetch";

export const updatePedidoCliente = async (form) => {
  const id = Number(form.id);
  const url = `https://inventarioapi-the3.onrender.com/api/PedidosClientes/${id}`;

  const payload = {
    clienteId: Number(form.clienteId),
    estado: String(form.estado ?? "").trim(),
    timestamp: form.timestamp || new Date().toISOString(),
    detalles: Array.isArray(form.detalles)
      ? form.detalles.map((d) => ({
          productoId: Number(d.productoId),
          cantidad: Number(d.cantidad),
          timestamp: d.timestamp || new Date().toISOString(),
        }))
      : [],
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};