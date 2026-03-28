import { apiFetch } from "../../utils/apiFetch";

export const confirmarPedidoCliente = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/PedidosClientes/${id}/confirmar`;
  return apiFetch(url, { method: "POST" });
};