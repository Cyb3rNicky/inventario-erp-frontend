import { apiFetch } from "../../utils/apiFetch";

export const cancelarPedidoCliente = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/PedidosClientes/${id}/cancelar`;
  return apiFetch(url, { method: "POST" });
};