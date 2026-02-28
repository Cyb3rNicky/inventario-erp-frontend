import { apiFetch } from "../../utils/apiFetch";

export const aprobarReabastecimiento = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Reabastecimientos/${id}/aprobar`;
  return apiFetch(url, { method: "POST" });
};