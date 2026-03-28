import { apiFetch } from "../../utils/apiFetch";

export const deletePedidoCliente = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/PedidosClientes/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};