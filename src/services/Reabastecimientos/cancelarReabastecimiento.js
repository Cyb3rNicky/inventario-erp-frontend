import { apiFetch } from "../../utils/apiFetch";

export const cancelarReabastecimiento = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Reabastecimientos/${id}/cancelar`;
  return apiFetch(url, { method: "POST" });
};